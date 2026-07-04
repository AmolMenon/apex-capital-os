import random, time

with open('services/llm_provider.py', 'r') as f:
    lines = f.readlines()

new_content = []
in_loop = False
for line in lines:
    if "for attempt in range(max_retries + 3):" in line:
        in_loop = True
        new_content.append("""        import random
        max_total_attempts = max_retries + 1
        for attempt in range(max_total_attempts):
            try:
                t0 = time.time()
                response = requests.post(url, json=payload, timeout=30)
                
                if response.status_code != 200:
                    error_msg = f"LLM API Error: {response.status_code} - {response.text}"
                    error_class = "UNKNOWN_ERROR"
                    if response.status_code in [401, 403]:
                        error_class = "AUTHENTICATION_FAILURE"
                    elif response.status_code == 400:
                        error_class = "INVALID_REQUEST"
                    elif response.status_code == 429:
                        if "GenerateRequestsPerDay" in response.text or "per day" in response.text.lower():
                            error_class = "DAILY_QUOTA_EXHAUSTED"
                        elif "model" in response.text.lower() and "quota" in response.text.lower() and "zero" in response.text.lower():
                            error_class = "MODEL_QUOTA_ZERO"
                        elif "tpm" in response.text.lower() or "tokens per minute" in response.text.lower():
                            error_class = "TRANSIENT_TPM_LIMIT"
                        else:
                            error_class = "TRANSIENT_RPM_LIMIT"
                    elif response.status_code >= 500:
                        error_class = "SERVER_ERROR"
                        
                    if error_class in ["DAILY_QUOTA_EXHAUSTED", "MODEL_QUOTA_ZERO", "AUTHENTICATION_FAILURE", "INVALID_REQUEST"]:
                        raise LLMProviderException(f"FAIL FAST [{error_class}]: {error_msg}")
                        
                    if attempt == max_total_attempts - 1:
                        raise LLMProviderException(f"MAX RETRIES EXCEEDED [{error_class}]: {error_msg}")
                        
                    base_delay = min(60, 2 ** attempt)
                    jitter = random.uniform(0, 0.2 * base_delay)
                    sleep_time = base_delay + jitter
                    
                    try:
                        resp_data = response.json()
                        for detail in resp_data.get("error", {}).get("details", []):
                            if detail.get("@type") == "type.googleapis.com/google.rpc.RetryInfo":
                                delay_str = detail.get("retryDelay", "0s")
                                if delay_str.endswith("s"):
                                    sleep_time = max(sleep_time, float(delay_str[:-1]))
                    except Exception:
                        pass
                        
                    print(f"Transient error ({error_class}). Sleeping for {sleep_time:.2f} seconds... (Attempt {attempt+1})")
                    time.sleep(sleep_time)
                    continue
                    
                data = response.json()
                
                try:
                    text_response = data['candidates'][0]['content']['parts'][0]['text']
                    if text_response.startswith("```json"):
                        text_response = text_response[7:-3]
                    elif text_response.startswith("```"):
                        text_response = text_response[3:-3]
                        
                    parsed_json = json.loads(text_response.strip())
                    usage = data.get("usageMetadata", {})
                    token_info = {
                        "input": usage.get("promptTokenCount", 0),
                        "output": usage.get("candidatesTokenCount", 0),
                        "latency_ms": int((time.time() - t0) * 1000)
                    }
                    return parsed_json, token_info
                except (KeyError, IndexError, json.JSONDecodeError) as e:
                    if attempt == max_total_attempts - 1:
                        raise LLMProviderException(f"Failed to parse LLM response into JSON: {str(e)}\nRaw Response: {data}")
                    time.sleep(1)
                    continue
                    
            except requests.exceptions.RequestException as e:
                error_class = "NETWORK_ERROR"
                if attempt == max_total_attempts - 1:
                    raise LLMProviderException(f"MAX RETRIES EXCEEDED [{error_class}]: Network error connecting to LLM provider: {str(e)}")
                base_delay = min(60, 2 ** attempt)
                jitter = random.uniform(0, 0.2 * base_delay)
                time.sleep(base_delay + jitter)
                
        raise LLMProviderException("Maximum retries exceeded")
""")
    elif in_loop:
        if line.strip() == 'raise LLMProviderException("Maximum retries exceeded")':
            in_loop = False
    else:
        new_content.append(line)

with open('services/llm_provider.py', 'w') as f:
    f.writelines(new_content)
