with open("run_vc01_batch.py", "r") as f:
    code = f.read()

code = code.replace("""    except LLMProviderException as e:
        if "DAILY_QUOTA_EXHAUSTED" in str(e):
            print("VC_01_BATCH_INCOMPLETE_QUOTA_EXHAUSTED")
            sys.exit(2)
        else:
            print("VC_01_BATCH_INCOMPLETE_PROVIDER_FAILURE")
            print(str(e))
            sys.exit(3)
    except Exception as e:
        print("VC_01_BATCH_INCOMPLETE_PROVIDER_FAILURE")
        print(str(e))
        sys.exit(3)""", """    except Exception as e:
        if "DAILY_QUOTA_EXHAUSTED" in str(e):
            print("VC_01_BATCH_INCOMPLETE_QUOTA_EXHAUSTED")
            sys.exit(2)
        else:
            print("VC_01_BATCH_INCOMPLETE_PROVIDER_FAILURE")
            print(str(e))
            sys.exit(3)""")

with open("run_vc01_batch.py", "w") as f:
    f.write(code)
