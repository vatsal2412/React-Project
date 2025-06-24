# 🎮 Tic Tac Toe — Built with Next.js 13

A modern, responsive Tic Tac Toe game built with **Next.js**, featuring two game modes, animated win detection, emoji-style symbols, and a mobile-friendly design inspired by [Behance UI references](https://www.behance.net/gallery/177430049/Tic-Tac-Toe-game-UI-DESIGN).

---

## 🚀 Features

- ✅ **Start Game** manually with a button
- ✅ Play against the **Computer 🤖** or in **2-Player mode 👥**
- ✅ Animated **highlight for winning cells**
- ✅ Clean and simple **emoji-style UI**: ❌ and ⭕
- ✅ Responsive for **mobile and desktop**
- ✅ **Step history** showing each move
- ✅ Timer starts only when game begins

---

## 🛠️ Tech Stack

| Tool       | Purpose              |
|------------|----------------------|
| ⚛️ React   | Component-based UI   |
| 🔀 Next.js | Routing & rendering  |
| 🎨 CSS     | Styling & animation  |

---

## 📦 Installation & Usage

# 1. **Clone the repository:**

    
      git clone 
      cd nextjs-tic-tac-toe


# 2. **Install dependencies:**
    
    npm install
# 3. **Run the development server:**
   
    npm run dev
# 4. **Open in browser:**
    
    http://localhost:3000
## Structure

```text
nextjs-tic-tac-toe/
│
├── app/
│   ├── page.jsx                 # Home screen (mode selection)
│   └── game/
│       └── page.jsx             # Game logic and layout
│
├── components/
│   └── GameBoard.jsx           # Board rendering component
│
├── public/
│   └── favicon.ico             # (Optional) favicon or assets
│  
│
├── styles/
│   └── globals.css             # Global styles, board, animation
│
├── .gitignore                  # Ignore node_modules, .next, etc.
├── README.md                   # Project description and usage
├── package.json                # Project metadata and dependencies
├── package-lock.json           # Dependency versions lock
└── next.config.js              # Next.js configuration
