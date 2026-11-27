// ======================================
// HABITLY - WEEK 2 JAVASCRIPT
// ======================================

// 1. SELECT HTML ELEMENTS

const habitGrid = document.getElementById("habitGrid");
const habitForm = document.getElementById("habitForm");
const habitInput = document.getElementById("habitInput");

const doneToday = document.getElementById("doneToday");
const totalHabits = document.getElementById("totalHabits");

const formMessage = document.getElementById("formMessage");

const currentDate = document.getElementById("currentDate");

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");

// 2. HABIT DATA

const defaultHabits = [
{
id: 1,
name: "Reading",
emoji: "📚",
completedDates: []
},
{
id: 2,
name: "Drink Water",
emoji: "💧",
completedDates: []
},
{
id: 3,
name: "Meditation",
emoji: "🧘",
completedDates: []
},
{
id: 4,
name: "Exercise",
emoji: "🏃",
completedDates: []
},
{
id: 5,
name: "Journaling",
emoji: "✍️",
completedDates: []
}
];

let habits = loadHabits();

let selectedEmoji = "🌱";

// 3. GET TODAY'S DATE

function getTodayDate() {

const date = new Date();

const year = date.getFullYear();

const month = String(date.getMonth() + 1).padStart(2, "0");

const day = String(date.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;

}

// DISPLAY CURRENT DATE

currentDate.textContent = new Date().toLocaleDateString("en-IN", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric"
});

// 4. LOAD HABITS FROM LOCAL STORAGE

function loadHabits() {

try {

    const savedHabits = localStorage.getItem("habitlyHabits");

    if (savedHabits !== null) {

        const parsedHabits = JSON.parse(savedHabits);

        if (
            Array.isArray(parsedHabits) &&
            parsedHabits.every(habit =>
                habit &&
                typeof habit.id === "number" &&
                typeof habit.name === "string" &&
                typeof habit.emoji === "string" &&
                Array.isArray(habit.completedDates)
            )
        ) {
            return parsedHabits;
        }

    }

} catch (error) {

    console.error("Unable to load habits:", error);

}

return defaultHabits;

}

// 5. SAVE HABITS

function saveHabits() {

try {

    localStorage.setItem("habitlyHabits", JSON.stringify(habits));

} catch (error) {

    console.error("Unable to save habits:", error);

    showMessage("Unable to save data. Please check browser storage.");

}

}

// 6. CREATE HABIT CARD

function createHabitCard(habit) {

const isCompleted = habit.completedDates.includes(getTodayDate());

return `

    <article class="habit-card">

        <div class="habit-icon">${habit.emoji}</div>

        <h3>${escapeHTML(habit.name)}</h3>

        <p class="habit-status">

            ${isCompleted ? "✨ Completed today!" : "🌱 One step at a time."}

        </p>

        <div class="habit-actions">

            <button
                class="complete-btn ${isCompleted ? "completed" : ""}"
                data-id="${habit.id}"
                type="button"
            >

                ${isCompleted ? "✓ Completed" : "Complete"}

            </button>

            <button
                class="delete-btn"
                data-id="${habit.id}"
                type="button"
                aria-label="Delete ${escapeHTML(habit.name)}"
            >

                🗑️

            </button>

        </div>

    </article>

`;

}

// Prevent HTML injection through habit names.

function escapeHTML(value) {

return value.replace(/[&<>"']/g, character => {

    const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return entities[character];

});

}

// 7. RENDER ALL HABITS

function renderHabits() {

if (habits.length === 0) {

    habitGrid.innerHTML = `

        <div class="empty-state">

            <h3>🌱 No habits yet!</h3>

            <p>Start your growth journey by adding your first habit.</p>

        </div>

    `;

} else {

    habitGrid.innerHTML = habits.map(createHabitCard).join("");

}

updateSummary();

}

// 8. UPDATE SUMMARY

function updateSummary() {

const today = getTodayDate();

const completedCount = habits.filter(habit =>
    habit.completedDates.includes(today)
).length;

doneToday.textContent = `${completedCount}/${habits.length}`;

totalHabits.textContent = habits.length;

}

// 9. SHOW FORM MESSAGE

function showMessage(message) {

formMessage.textContent = message;

}

// 10. EMOJI SELECTION

const emojiButtons = document.querySelectorAll(".emoji-btn");

emojiButtons.forEach(button => {

button.addEventListener("click", () => {

    emojiButtons.forEach(btn =>
        btn.classList.remove("selected")
    );

    button.classList.add("selected");

    selectedEmoji = button.dataset.emoji;

});

});

// 11. ADD NEW HABIT

habitForm.addEventListener("submit", function(event) {

event.preventDefault();

const habitName = habitInput.value.trim();

if (habitName === "") {

    showMessage("Please enter a habit name.");

    habitInput.focus();

    return;

}

const duplicateHabit = habits.some(habit =>
    habit.name.toLowerCase() === habitName.toLowerCase()
);

if (duplicateHabit) {

    showMessage("This habit already exists. Try another one!");

    return;

}

const newHabit = {

    id: Date.now(),

    name: habitName,

    emoji: selectedEmoji,

    completedDates: []

};

habits.push(newHabit);

saveHabits();

renderHabits();

habitForm.reset();

showMessage("Your new habit has been added successfully! 🌱");

habitInput.focus();

});

// 12. COMPLETE AND DELETE HABITS

habitGrid.addEventListener("click", function(event) {

const button = event.target.closest("button");

if (!button) return;

const habitId = Number(button.dataset.id);

const habit = habits.find(item => item.id === habitId);

if (!habit) return;


// COMPLETE / UNDO

if (button.classList.contains("complete-btn")) {

    const today = getTodayDate();

    if (habit.completedDates.includes(today)) {

        habit.completedDates = habit.completedDates.filter(
            date => date !== today
        );

    } else {

        habit.completedDates.push(today);

    }

    saveHabits();

    renderHabits();

}


// DELETE

if (button.classList.contains("delete-btn")) {

    const confirmDelete = confirm(
        `Are you sure you want to delete "${habit.name}"?`
    );

    if (confirmDelete) {

        habits = habits.filter(item => item.id !== habitId);

        saveHabits();

        renderHabits();

    }

}

});

// 13. DAILY QUOTE FALLBACK

const fallbackQuotes = [

{
    quote: "Small steps every day lead to big results.",
    author: "Unknown"
},

{
    quote: "Success is the sum of small efforts repeated daily.",
    author: "Robert Collier"
},

{
    quote: "Great things are done by a series of small things brought together.",
    author: "Vincent van Gogh"
},

{
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
}

];

// 14. FETCH DAILY QUOTE

async function fetchDailyQuote() {

quoteText.textContent = "Loading...";

quoteAuthor.textContent = "";

try {

    const response = await fetch(
        "https://dummyjson.com/quotes/random"
    );

    if (!response.ok) {

        throw new Error("Quote request failed");

    }

    const data = await response.json();

    if (!data.quote || !data.author) {

        throw new Error("Invalid quote data");

    }

    quoteText.textContent = `"${data.quote}"`;

    quoteAuthor.textContent = `— ${data.author}`;

} catch (error) {

    console.error("Quote API error:", error);

    const randomIndex = Math.floor(
        Math.random() * fallbackQuotes.length
    );

    const quote = fallbackQuotes[randomIndex];

    quoteText.textContent = `"${quote.quote}"`;

    quoteAuthor.textContent = `— ${quote.author}`;

}

}

// 15. INITIALIZE APPLICATION

renderHabits();

fetchDailyQuote();
