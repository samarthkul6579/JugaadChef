# JugaadChef

**Cook Smart With What You Have**

RasoiAI is an AI-powered web app that helps people cook using the ingredients they already have.

Instead of just showing recipes, it acts as a **cooking decision engine** that suggests personalized recipes and intelligent ingredient substitutions — while also **teaching users why those substitutions work**.

Built for **Indian students and households** who face real cooking constraints like missing ingredients, limited budget, allergies, or lack of cooking knowledge.

---

# The Problem

Most recipe apps assume users have **all the ingredients and cooking experience**.

Reality is different.

People often face:

• Missing ingredients
• Limited budget
• Dietary restrictions
• No formal cooking training
• Confusion about substitutions

Existing apps tell users **what to cook**.
They do not help users cook **with what they actually have**.

---

# Our Approach

RasoiAI converts:

**Available Ingredients → Personalized Recipe → Smart Substitutes**

in seconds.

Users provide:

• Ingredients they have
• Budget preference
• Allergies or dietary restrictions
• Taste preferences

The system generates recipes and suggests **scientifically compatible substitutions**.

Example:

If a recipe requires **paneer**, but the user doesn't have it, the system may suggest **tofu** and explain:

> Tofu works as a substitute because it has a similar texture and protein structure that behaves similarly during cooking.

This **education-first approach** helps users learn cooking principles instead of blindly following recipes.

---

# Key Features

**Ingredient-to-Recipe Generator**
Enter available ingredients and get recipe suggestions instantly.

**Intelligent Substitution Engine**
Suggests replacements using **FlavorDB**, based on flavor chemistry and cooking function.

**Education-First Cooking**
Every substitution includes a short explanation of **why it works**.

**Budget & Constraint Awareness**
Recipes adapt to ingredient availability, budget, allergies, and calorie needs.

**Indian-First Cooking System**
Built using **RecipeDB**, focused on real Indian cooking patterns.

**Hindi Input Support**
Users can enter ingredients naturally.

Example:
`mere paas chawal aur aloo hai`

---

# Why RasoiAI Is Different

Most cooking apps are **recipe libraries**.

RasoiAI is a **cooking intelligence system**.

| Existing Apps                | RasoiAI                          |
| ---------------------------- | -------------------------------- |
| Static recipes               | Personalized recipes             |
| Assumes perfect ingredients  | Works with available ingredients |
| No substitution intelligence | Scientific substitution engine   |
| Western-focused recipes      | Indian kitchen focused           |
| Blind AI generation          | FlavorDB + rule-based reasoning  |
| No learning                  | Education-first explanations     |

---

# Tech Stack

**Frontend**
React.js
Tailwind CSS

**Backend**
Python Flask

**Data Sources**
RecipeDB (Indian recipe dataset)
FlavorDB (flavor compatibility database)

**APIs**
Spoonacular
Edamam

**Deployment**
Frontend – Vercel
Backend – Render

---

# How It Works

1. User enters available ingredients and preferences
2. System retrieves candidate recipes from RecipeDB
3. Missing ingredients are detected
4. FlavorDB suggests compatible substitutes
5. Constraints (budget, allergies, calories) are applied
6. Final personalized recipe is generated with explanations

---

# Impact

RasoiAI helps:

• Students cook affordable meals in hostels and PGs
• Households reduce food waste
• Beginners learn cooking fundamentals
• People with dietary restrictions cook safely

The goal is simple:

Make cooking **flexible, affordable, and understandable**.

---

# Vision

Cooking shouldn't depend on having the **perfect ingredients**.

RasoiAI helps people cook confidently **with whatever they have** — while learning the science behind it.

---

**Existing apps show recipes.
RasoiAI teaches cooking.**

---
