# Patika App 📱

Patika App is a React Native mobile application built with [Expo](https://expo.dev/) and [Expo Router](https://docs.expo.dev/router/introduction/). It serves as the frontend interface for the Patika platform, providing users with authentication, business discovery, and dashboard features.

## 🚀 Tech Stack

* **Framework:** React Native / Expo (SDK 51)
* **Navigation:** Expo Router (File-based routing)
* **Styling:** NativeWind / Tailwind CSS
* **State/Storage:** React Context API & Async Storage
* **Backend Integration:** Custom API service (`lib/api.js`) connecting to the Patika API.

## 📂 Project Structure

This project follows a standard Expo Router file-based routing architecture:

* **`app/`**: Contains the main routing logic and screens.
    * **`(auth)/`**: Authentication screens (Welcome, Phone entry, OTP Verification).
    * **`(tabs)/`**: Main application interface with bottom tabs (Dashboard, Search, Profile).
    * **`business/`**: Dynamic routing screens for individual business details (`[slug].jsx`).
* **`components/`**: Reusable UI components (e.g., `BusinessCard.jsx`).
* **`lib/`**: Core application logic, utilities, and services.
    * `api.js`: Handles backend network requests.
    * `AuthContext.jsx`: Manages global user authentication state.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Git](https://git-scm.com/)
* The **Expo Go** app installed on your iOS or Android physical device, or an emulator set up on your machine.
