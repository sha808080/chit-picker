# Chit Picker - Decision Maker

A clean, interactive web app that helps users make decisions by randomly picking from a list of custom chits.

![Chit Picker Demo](https://via.placeholder.com/800x400?text=Chit+Picker+Demo)

## Features

- **Dynamic Chit Input**: Select 2-20 chits and enter custom text for each
- **Fisher-Yates Shuffle**: Properly randomizes chits without displaying the order
- **Random Selection**: Pick one chit at a time with no repetition until all are picked
- **History Tracking**: Saves recent picks using localStorage
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works beautifully on mobile and desktop
- **Smooth Animations**: Engaging visual feedback for all interactions

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **JavaScript (ES6+)** - Logic

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Select Number of Chits**: Use the slider to choose how many options you need (2-20)
2. **Generate Inputs**: Click "Generate Chits" to create input fields
3. **Enter Your Options**: Fill in each chit with your choices
4. **Shuffle**: Click "Shuffle" to randomize the order (internally)
5. **Pick**: Click "Pick One" to randomly select a chit
6. **Reset**: Start over with new chits

## Project Structure

```
chit-picker/
├── src/
│   ├── components/
│   │   └── ChitPicker.jsx    # Main component
│   ├── App.jsx               # App wrapper with dark mode
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## License

MIT License - Feel free to use this project for your own purposes.
