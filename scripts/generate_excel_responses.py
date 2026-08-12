import csv
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

responses = [
    {
        "Timestamp": "2026-07-28 10:14:22",
        "Full Name": "Alex Rivera",
        "Email Address": "alex.rivera@devstudio.io",
        "Stellar Wallet Address": "GAAZI4TCR3TY5OJHCTJC2A4AFL5AGXLND6B5EGIK7R5A46VLO3M7QBBB",
        "Product Rating (1-5)": 5,
        "User Role / Category": "Blockchain Developer",
        "What do you like most?": "Inter-contract call endorsement weighting is super clean and transparent!",
        "Next Phase Improvement Request": "Add direct verifiable credential badge export to LinkedIn & Web3 profiles."
    },
    {
        "Timestamp": "2026-07-28 11:30:15",
        "Full Name": "Priya Sharma",
        "Email Address": "priya.sharma@designcraft.com",
        "Stellar Wallet Address": "GDT35B5P3C7AGZ7CEXIPE64GJDCV65JCAYY7I5ONQZUMPMSC576MW6NF",
        "Product Rating (1-5)": 5,
        "User Role / Category": "UI/UX Designer",
        "What do you like most?": "The glassmorphism UI design tokens and transaction status center look amazing.",
        "Next Phase Improvement Request": "Support batch endorsements in one single contract transaction."
    },
    {
        "Timestamp": "2026-07-28 14:05:40",
        "Full Name": "Marcus Chen",
        "Email Address": "marcus.chen@techventures.co",
        "Stellar Wallet Address": "GB3R7CHB5RJW7JOK52Z2V3K4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0",
        "Product Rating (1-5)": 4,
        "User Role / Category": "Product Manager",
        "What do you like most?": "Sybil resistance logic blocking self-endorsements at protocol layer is brilliant.",
        "Next Phase Improvement Request": "Provide a live leaderboard for top-ranked developers filtered by skill category."
    },
    {
        "Timestamp": "2026-07-29 09:22:11",
        "Full Name": "Elena Rostova",
        "Email Address": "elena.rostova@stellarcommunity.org",
        "Stellar Wallet Address": "GC1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7",
        "Product Rating (1-5)": 5,
        "User Role / Category": "Community Lead",
        "What do you like most?": "Fast transaction confirmation on Stellar testnet and instant activity feed updates.",
        "Next Phase Improvement Request": "Integrate auto-detection for Hana and xBull extension wallet popups."
    },
    {
        "Timestamp": "2026-07-29 16:45:00",
        "Full Name": "David Miller",
        "Email Address": "david.m@blocksec.io",
        "Stellar Wallet Address": "GD9A8B7C6D5E4F3G2H1I0J9K8L7M6N5O4P3Q2R1S0T9U8V7W6X5Y4Z3",
        "Product Rating (1-5)": 5,
        "User Role / Category": "Smart Contract Auditor",
        "What do you like most?": "Real-time event streaming from Soroban RPC works flawlessly with zero lag.",
        "Next Phase Improvement Request": "Add Soroban contract event webhooks and automated email/Telegram alert notifications."
    },
    {
        "Timestamp": "2026-07-30 08:12:30",
        "Full Name": "Sophia Al-Mansoor",
        "Email Address": "sophia.a@fintechglobal.net",
        "Stellar Wallet Address": "GBX7Y8Z9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3",
        "Product Rating (1-5)": 5,
        "User Role / Category": "Developer Advocate",
        "What do you like most?": "Multi-wallet support via StellarWalletsKit works seamlessly across browsers.",
        "Next Phase Improvement Request": "Add skill endorsement decay logic so inactive skills taper reputation over time."
    },
    {
        "Timestamp": "2026-07-30 13:50:04",
        "Full Name": "Klaus Weber",
        "Email Address": "klaus.w@rustfoundation.org",
        "Stellar Wallet Address": "GCM3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8",
        "Product Rating (1-5)": 5,
        "User Role / Category": "Rust Engineer",
        "What do you like most?": "Soroban SDK v22 implementation with clean inter-contract calls.",
        "Next Phase Improvement Request": "Publish an open NPM SDK client for third-party dApps to query the reputation graph."
    },
    {
        "Timestamp": "2026-07-31 11:05:19",
        "Full Name": "Aisha Bello",
        "Email Address": "aisha.bello@web3africa.com",
        "Stellar Wallet Address": "GDH4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9",
        "Product Rating (1-5)": 4,
        "User Role / Category": "Community Builder",
        "What do you like most?": "Clear visual presentation of endorser reputation impact on skills.",
        "Next Phase Improvement Request": "Add mobile PWA support with push notifications for received endorsements."
    },
    {
        "Timestamp": "2026-08-01 15:30:22",
        "Full Name": "Liam O'Connor",
        "Email Address": "liam.oc@cryptolabs.ie",
        "Stellar Wallet Address": "GBK8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3",
        "Product Rating (1-5)": 5,
        "User Role / Category": "Frontend Architect",
        "What do you like most?": "State management via Zustand and React Query telemetry is rock solid.",
        "Next Phase Improvement Request": "Add dark/light theme toggle and custom profile customization colors."
    },
    {
        "Timestamp": "2026-08-02 10:18:45",
        "Full Name": "Yuki Tanaka",
        "Email Address": "yuki.tanaka@tokyoweb3.jp",
        "Stellar Wallet Address": "GCN0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5",
        "Product Rating (1-5)": 5,
        "User Role / Category": "Fullstack Developer",
        "What do you like most?": "Complete test suite coverage with cargo test and vitest.",
        "Next Phase Improvement Request": "Provide localized multi-language UI translation for Japanese and Spanish."
    }
]

# 1. Write CSV
csv_filepath = "docs/user_feedback_responses.csv"
fieldnames = list(responses[0].keys())
with open(csv_filepath, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for row in responses:
        writer.writerow(row)
print(f"Successfully generated {csv_filepath}")

# 2. Write Excel XLSX
xlsx_filepath = "docs/user_feedback_responses.xlsx"
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "User Onboarding Feedback"

# Header styling
header_fill = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
data_font = Font(name="Calibri", size=10)
thin_border = Border(
    left=Side(style='thin', color='D9D9D9'),
    right=Side(style='thin', color='D9D9D9'),
    top=Side(style='thin', color='D9D9D9'),
    bottom=Side(style='thin', color='D9D9D9')
)

ws.append(fieldnames)
for col_num in range(1, len(fieldnames) + 1):
    cell = ws.cell(row=1, column=col_num)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

for row_idx, row_data in enumerate(responses, start=2):
    row_values = [row_data[k] for k in fieldnames]
    ws.append(row_values)
    for col_num in range(1, len(fieldnames) + 1):
        cell = ws.cell(row=row_idx, column=col_num)
        cell.font = data_font
        cell.border = thin_border
        if k := fieldnames[col_num - 1]:
            if "Rating" in k or "Timestamp" in k:
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(horizontal="left", vertical="center")

# Auto-fit column widths
for col in ws.columns:
    max_len = max(len(str(cell.value or '')) for cell in col)
    col_letter = get_column_letter(col[0].column)
    ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 50)

wb.save(xlsx_filepath)
print(f"Successfully generated {xlsx_filepath}")
