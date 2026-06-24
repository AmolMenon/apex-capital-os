import requests
import time

base_url = "http://127.0.0.1:8000"

def seed_analysis():
    print("Triggering analysis pipeline for deals 1-5...")
    for i in range(1, 6):
        print(f"\\n--- Deal {i} ---")
        
        # 1. Analyze core
        print(f"Triggering core analysis for deal {i}...")
        try:
            requests.post(f"{base_url}/analyze/{i}", timeout=60)
        except Exception as e:
            print("Failed core:", e)
        time.sleep(1) # give it a moment as it's async in backend
        
        # 2. Research
        print(f"Triggering research for deal {i}...")
        try:
            requests.post(f"{base_url}/research/{i}", timeout=60)
        except Exception as e:
            print("Failed research:", e)
            
        # 3. Deck
        print(f"Triggering deck for deal {i}...")
        try:
            payload = {
                "deck_name": "Pitch Deck v1",
                "raw_text": "We are revolutionizing the industry with our new AI platform. We have $1M in ARR and are raising $5M at a $25M valuation."
            }
            requests.post(f"{base_url}/decks/analyze/{i}", json=payload, timeout=60)
        except Exception as e:
            print("Failed deck:", e)
            
        # 4. Diligence
        print(f"Triggering diligence for deal {i}...")
        try:
            requests.post(f"{base_url}/diligence/{i}", timeout=60)
        except Exception as e:
            print("Failed diligence:", e)

        # 5. Conversation
        print(f"Triggering conversation for deal {i}...")
        try:
            transcript = "Investor: Can you explain your CAC payback? Founder: It's currently 6 months, down from 9 months last year."
            if i == 1:
                transcript = "Investor: The ARR looks great. Founder: We are exactly on track."
            elif i == 2:
                transcript = "Investor: Is there proof of willingness to pay? Founder: Not yet, we are pre-revenue on the subscriptions but pilots show promise."
            elif i == 3:
                transcript = "Investor: Any regulatory blockers? Founder: We need EPA approval which could take 2 years."
            elif i == 4:
                transcript = "Investor: What is the real credit risk? Founder: Actually we take on 100% of the default risk, which is higher than what we claimed."
                
            payload = {
                "title": "Initial Screen",
                "conversation_type": "Intro Call",
                "date": "2024-05-01",
                "participants": "Founder, Investor",
                "raw_text": transcript
            }
            requests.post(f"{base_url}/conversations/{i}", json=payload, timeout=60)
        except Exception as e:
            print("Failed conversation:", e)

        # 6. Fund Fit
        print(f"Triggering fund fit for deal {i}...")
        try:
            requests.post(f"{base_url}/fund/deals/{i}/fit", timeout=60)
        except Exception as e:
            print("Failed fund fit:", e)

    print("\\nAll seed analysis triggered!")

if __name__ == "__main__":
    seed_analysis()
