import requests

def run():
    print("Seeding Fund Fit data...")
    for i in range(1, 6):
        print(f"Triggering Fund Fit for deal {i}...")
        try:
            res = requests.post(f"http://127.0.0.1:8000/fund/deals/{i}/fit")
            print(res.status_code)
        except Exception as e:
            print("Failed:", e)
    print("Done")

if __name__ == "__main__":
    run()
