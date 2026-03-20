from flask import Flask, request, jsonify, send_from_directory, abort

app = Flask(__name__)

MENU = [
    {"name": "Momo", "price": "NPR 180", "keywords": ["momo", "dumpling"], "desc": "Steamed or fried dumplings stuffed with meat or vegetables, served with spicy chutney."},
    {"name": "Dal Bhat", "price": "NPR 250", "keywords": ["dal bhat", "dal", "bhat"], "desc": "Traditional Nepali rice and lentil soup with curried vegetables."},
    {"name": "Kukhura Ko Masu", "price": "NPR 320", "keywords": ["kukhura", "chicken curry", "masu"], "desc": "Nepali-style chicken curry with rich spices and fresh herbs."},
    {"name": "Sel Roti", "price": "NPR 100", "keywords": ["sel roti", "roti"], "desc": "Sweet, circular rice flour bread fried to golden crispness, a festival staple."},
    {"name": "Bara", "price": "NPR 120", "keywords": ["bara"], "desc": "Newari lentil patties—crispy outside, soft inside; can be plain or with egg/meat."},
    {"name": "Gundruk Soup", "price": "NPR 90", "keywords": ["gundruk soup", "gundruk", "soup"], "desc": "Fermented leafy greens soup, tangy and packed with probiotics."},
    {"name": "Sukuti", "price": "NPR 250", "keywords": ["sukuti", "dry meat"], "desc": "Air-dried spiced meat (buff or goat), grilled and served as a snack or with beer."},
    {"name": "Yomari", "price": "NPR 140", "keywords": ["yomari"], "desc": "Sweet Newari steamed dumpling filled with jaggery and sesame paste, festive delight."},
    {"name": "Aloo Achar", "price": "NPR 100", "keywords": ["aloo achar", "achar", "potato"], "desc": "Tangy and spicy potato salad with mustard oil, sesame, and turmeric."},
    {"name": "Chatamari", "price": "NPR 180", "keywords": ["chatamari"], "desc": "Newari rice flour crepe topped with mince meat, eggs, and spices."},
    {"name": "Pani Puri", "price": "NPR 80", "keywords": ["pani puri"], "desc": "Crispy fried hollow balls stuffed with potatoes, chickpeas and tangy spicy water."},
    {"name": "Thukpa", "price": "NPR 230", "keywords": ["thukpa", "noodle soup"], "desc": "Warm noodle soup with vegetables, chicken or buff, and Himalayan spices."},
    {"name": "Kwati", "price": "NPR 150", "keywords": ["kwati"], "desc": "A rich soup made from a blend of nine different sprouted beans."},
    {"name": "Palak Paneer", "price": "NPR 210", "keywords": ["palak paneer", "paneer"], "desc": "Nepali-style creamy spinach with paneer cheese cubes, lightly spiced."},
    {"name": "Lassi", "price": "NPR 90", "keywords": ["lassi"], "desc": "Traditional cold yogurt drink, sweet or salted for cooling off in summer."},
    {"name": "Choyla", "price": "NPR 260", "keywords": ["choyla"], "desc": "Newari-style grilled spicy meat (usually buff or chicken), smoky and fiery."},
    {"name": "Bhatmas Sadeko", "price": "NPR 90", "keywords": ["bhatmas sadeko", "bhatmas"], "desc": "Soybean salad with onions, green chili, ginger, and coriander—crunchy and flavorful!"},
    {"name": "Fini Roti", "price": "NPR 120", "keywords": ["fini roti"], "desc": "Crispy, flaky and sweet fried bread, a festive Nepali treat."},
]

CONTACT = {
    "email": "info@dailymomo.com",
    "phone": "+977-9800000000",
}


def normalize(text: str) -> str:
    return (text or "").strip().lower()


@app.get("/")
def home():
    return send_from_directory(".", "index.html")


@app.get("/profile")
def profile_page():
    return send_from_directory(".", "profile.html")


@app.post("/api/profile")
def api_profile():
    data = request.get_json(force=True)  # JSON from the browser
    # TODO: implement real backend logic (save to DB / send email)
    return jsonify({"ok": True, "received": data})


@app.post("/api/chat")
def api_chat():
    payload = request.get_json(silent=True) or {}
    user_message = normalize(payload.get("message", ""))

    if not user_message:
        return jsonify({"reply": "Please type your question (example: 'menu', 'price of momo', 'contact')."})

    # Greetings
    if any(k in user_message for k in ["hi", "hello", "hey", "hola", "namaste"]):
        return jsonify(
            {
                "reply": "Hi! I’m the Aroma Café helper. Ask me about the menu, prices, or contact. Example: 'menu' or 'price of dal bhat'.",
            }
        )

    # Contact / location
    if any(k in user_message for k in ["contact", "email", "phone", "call"]):
        return jsonify({"reply": f"Contact us at {CONTACT['email']} or {CONTACT['phone']}. "})

    # About / chef
    if any(k in user_message for k in ["about", "chef", "staff"]):
        return jsonify({"reply": "Aroma Café brings Nepal-inspired flavors. Ask for a specific dish and I’ll share its price and description."})

    # Menu intent
    if any(k in user_message for k in ["menu", "items", "food", "dishes"]):
        parts = [f"{m['name']} ({m['price']})" for m in MENU]
        # Keep reply reasonably short for chat
        preview = ", ".join(parts[:10])
        more = " (and more dishes available if you ask!)"
        return jsonify({"reply": f"Our menu includes: {preview}{more}"})

    # Price intent + dish lookup
    if any(k in user_message for k in ["price", "cost", "how much", "npr"]):
        for dish in MENU:
            if any(kw in user_message for kw in dish["keywords"]):
                return jsonify({"reply": f"{dish['name']} costs {dish['price']}. {dish['desc']}"})        
        return jsonify({"reply": "Tell me the dish name (example: 'price of momo' or 'price of lassi')."})

    # General dish lookup (even without price keywords)
    for dish in MENU:
        if any(kw in user_message for kw in dish["keywords"]):
            return jsonify({"reply": f"{dish['name']} ({dish['price']}). {dish['desc']}"})

    # Fallback
    return jsonify(
        {
            "reply": "I can help with cafe questions. Try: 'menu', 'price of momo', or 'contact'.",
        }
    )


@app.get("/<path:filename>")
def serve_static_files(filename: str):
    # Avoid interfering with API routes
    if filename.startswith("api/"):
        abort(404)
    return send_from_directory(".", filename)


if __name__ == "__main__":
    app.run(debug=True)