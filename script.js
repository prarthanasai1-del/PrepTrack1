/* =========================================================
   PREPTRACK - COMPLETE JAVASCRIPT
   Frontend Only
   HTML + CSS + JavaScript + localStorage
========================================================= */


/* =========================================================
   1. DEFAULT DATA
========================================================= */

const defaultData = {

    username: "",

    studyHours: 0,

    subjects: [
        {
            name: "DSA",
            progress: 0
        },
        {
            name: "Operating Systems",
            progress: 0
        },
        {
            name: "DBMS",
            progress: 0
        },
        {
            name: "Computer Networks",
            progress: 0
        },
        {
            name: "OOP",
            progress: 0
        }
    ],

    codingProblems: [],

    goals: [],

    activity: {},

    darkMode: false

};


/* =========================================================
   2. LOAD DATA FROM LOCAL STORAGE
========================================================= */

let data =
    JSON.parse(
        localStorage.getItem("prepTrackData")
    ) || structuredClone(defaultData);


/* =========================================================
   3. SAVE DATA
========================================================= */

function saveData() {

    localStorage.setItem(
        "prepTrackData",
        JSON.stringify(data)
    );

}


/* =========================================================
   4. LOGIN
========================================================= */

function loginUser() {

    const input =
        document.getElementById("usernameInput");

    const username =
        input.value.trim();


    if (username === "") {

        alert("Please enter your name.");

        return;
    }


    data.username = username;

    saveData();


    document
        .getElementById("loginScreen")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    initializeDashboard();

}


/* =========================================================
   5. LOGOUT
========================================================= */

function logoutUser() {

    document
        .getElementById("app")
        .classList.add("hidden");


    document
        .getElementById("loginScreen")
        .classList.remove("hidden");

}


/* =========================================================
   6. INITIALIZE DASHBOARD
========================================================= */

function initializeDashboard() {

    document.getElementById(
        "displayUsername"
    ).textContent = data.username;


    document.getElementById(
        "profileAvatar"
    ).textContent =
        data.username
            .charAt(0)
            .toUpperCase();


    applyDarkMode();


    renderAll();

}


/* =========================================================
   7. RENDER EVERYTHING
========================================================= */

function renderAll() {

    updateStatistics();

    renderSubjects();

    renderCodingProblems();

    renderGoals();

    renderCalendar();

    renderCharts();

    generateRecommendations();

    updateStreak();

}


/* =========================================================
   8. STUDY HOURS
========================================================= */

function addStudyHours() {

    const input =
        document.getElementById("studyInput");


    const hours =
        parseFloat(input.value);


    if (
        isNaN(hours) ||
        hours <= 0
    ) {

        alert(
            "Please enter valid study hours."
        );

        return;
    }


    data.studyHours += hours;


    const today =
        getToday();


    if (!data.activity[today]) {

        data.activity[today] = {

            studyHours: 0,

            problems: 0,

            goals: 0

        };

    }


    data.activity[today].studyHours += hours;


    saveData();


    input.value = "";


    showNotification(
        `📚 ${hours} study hours added!`
    );


    renderAll();

}


/* =========================================================
   9. UPDATE STATISTICS
========================================================= */

function updateStatistics() {

    document.getElementById(
        "studyHours"
    ).textContent =
        Number(data.studyHours).toFixed(1);


    const solved =
        data.codingProblems.filter(
            problem =>
                problem.status === "Solved"
        ).length;


    document.getElementById(
        "problemsSolved"
    ).textContent = solved;


    let total = 0;


    data.subjects.forEach(
        subject => {

            total += subject.progress;

        }
    );


    const overall =
        data.subjects.length > 0
            ? Math.round(
                total /
                data.subjects.length
            )
            : 0;


    document.getElementById(
        "overallProgress"
    ).textContent =
        overall + "%";

}


/* =========================================================
   10. SUBJECTS
========================================================= */

function renderSubjects() {

    const list =
        document.getElementById(
            "subjectList"
        );


    const select =
        document.getElementById(
            "subjectSelect"
        );


    list.innerHTML = "";

    select.innerHTML = "";


    data.subjects.forEach(
        subject => {


            /* Subject Progress */

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "subject-item";


            item.innerHTML = `

                <div class="subject-row">

                    <span>
                        ${subject.name}
                    </span>

                    <strong>
                        ${subject.progress}%
                    </strong>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="
                            width:
                            ${subject.progress}%;
                        "
                    ></div>

                </div>

            `;


            list.appendChild(item);


            /* Dropdown */

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject.name;


            option.textContent =
                subject.name;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   11. UPDATE SUBJECT
========================================================= */

function updateSubject() {

    const subjectName =
        document.getElementById(
            "subjectSelect"
        ).value;


    const progress =
        parseInt(
            document.getElementById(
                "subjectProgress"
            ).value
        );


    if (
        isNaN(progress) ||
        progress < 0 ||
        progress > 100
    ) {

        alert(
            "Progress must be between 0 and 100."
        );

        return;
    }


    const subject =
        data.subjects.find(
            item =>
                item.name === subjectName
        );


    if (subject) {

        subject.progress =
            progress;

    }


    saveData();


    document.getElementById(
        "subjectProgress"
    ).value = "";


    showNotification(
        `📚 ${subjectName} updated to ${progress}%`
    );


    renderAll();

}


/* =========================================================
   12. CODING TRACKER
========================================================= */

function addCodingProblem() {

    const title =
        document.getElementById(
            "problemTitle"
        ).value.trim();


    const platform =
        document.getElementById(
            "codingPlatform"
        ).value;


    const difficulty =
        document.getElementById(
            "difficulty"
        ).value;


    const status =
        document.getElementById(
            "problemStatus"
        ).value;


    if (title === "") {

        alert(
            "Please enter a problem name."
        );

        return;
    }


    const problem = {

        id: Date.now(),

        title: title,

        platform: platform,

        difficulty: difficulty,

        status: status,

        date: getToday()

    };


    data.codingProblems.push(
        problem
    );


    /* Add activity if solved */

    if (status === "Solved") {

        addCodingActivity();

    }


    saveData();


    document.getElementById(
        "problemTitle"
    ).value = "";


    showNotification(
        "💻 Coding problem added!"
    );


    renderAll();

}


/* =========================================================
   13. CODING ACTIVITY
========================================================= */

function addCodingActivity() {

    const today =
        getToday();


    if (!data.activity[today]) {

        data.activity[today] = {

            studyHours: 0,

            problems: 0,

            goals: 0

        };

    }


    data.activity[today]
        .problems++;

}


/* =========================================================
   14. RENDER CODING TABLE
========================================================= */

function renderCodingProblems() {

    const table =
        document.getElementById(
            "codingTable"
        );


    table.innerHTML = "";


    let easy = 0;

    let medium = 0;

    let hard = 0;


    data.codingProblems.forEach(
        problem => {


            if (
                problem.status ===
                "Solved"
            ) {

                if (
                    problem.difficulty ===
                    "Easy"
                ) easy++;


                if (
                    problem.difficulty ===
                    "Medium"
                ) medium++;


                if (
                    problem.difficulty ===
                    "Hard"
                ) hard++;

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        problem.title
                    )}
                </td>

                <td>
                    ${problem.platform}
                </td>

                <td>
                    ${problem.difficulty}
                </td>

                <td>
                    ${
                        problem.status ===
                        "Solved"
                            ? "✅ Solved"
                            : "⏳ Pending"
                    }
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="
                            deleteCodingProblem(
                                ${problem.id}
                            )
                        "
                    >
                        🗑 Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );


    document.getElementById(
        "easyCount"
    ).textContent = easy;


    document.getElementById(
        "mediumCount"
    ).textContent = medium;


    document.getElementById(
        "hardCount"
    ).textContent = hard;


    if (
        data.codingProblems.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        color:var(--muted);
                        padding:25px;
                    "
                >

                    No coding problems yet.
                    Add your first problem! 🚀

                </td>

            </tr>

        `;

    }

}


/* =========================================================
   15. DELETE CODING PROBLEM
========================================================= */

function deleteCodingProblem(id) {

    const confirmDelete =
        confirm(
            "Delete this coding problem?"
        );


    if (!confirmDelete) return;


    data.codingProblems =
        data.codingProblems.filter(
            problem =>
                problem.id !== id
        );


    saveData();


    showNotification(
        "Coding problem deleted."
    );


    renderAll();

}


/* =========================================================
   16. GOALS
========================================================= */

function addGoal() {

    const input =
        document.getElementById(
            "goalInput"
        );


    const text =
        input.value.trim();


    if (text === "") {

        alert(
            "Please enter a goal."
        );

        return;
    }


    data.goals.push({

        id: Date.now(),

        text: text,

        completed: false,

        date: getToday()

    });


    saveData();


    input.value = "";


    showNotification(
        "🎯 Goal added!"
    );


    renderAll();

}


/* =========================================================
   17. RENDER GOALS
========================================================= */

function renderGoals() {

    const list =
        document.getElementById(
            "goalList"
        );


    list.innerHTML = "";


    let completed = 0;


    data.goals.forEach(
        goal => {


            if (goal.completed) {

                completed++;

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "goal-item";


            item.innerHTML = `

                <input
                    type="checkbox"
                    ${
                        goal.completed
                            ? "checked"
                            : ""
                    }

                    onchange="
                        toggleGoal(
                            ${goal.id}
                        )
                    "
                >


                <span
                    class="
                        goal-text
                        ${
                            goal.completed
                                ? "goal-completed"
                                : ""
                        }
                    "
                >

                    ${escapeHTML(
                        goal.text
                    )}

                </span>


                <button
                    class="delete-btn"
                    onclick="
                        deleteGoal(
                            ${goal.id}
                        )
                    "
                >

                    🗑

                </button>

            `;


            list.appendChild(item);

        }
    );


    document.getElementById(
        "goalProgress"
    ).textContent =

        `${completed} / ${data.goals.length} completed`;

}


/* =========================================================
   18. TOGGLE GOAL
========================================================= */

function toggleGoal(id) {

    const goal =
        data.goals.find(
            item =>
                item.id === id
        );


    if (!goal) return;


    goal.completed =
        !goal.completed;


    if (goal.completed) {

        const today =
            getToday();


        if (!data.activity[today]) {

            data.activity[today] = {

                studyHours: 0,

                problems: 0,

                goals: 0

            };

        }


        data.activity[today]
            .goals++;


        showNotification(
            "🎉 Goal completed!"
        );

    }


    saveData();


    renderAll();

}


/* =========================================================
   19. DELETE GOAL
========================================================= */

function deleteGoal(id) {

    data.goals =
        data.goals.filter(
            goal =>
                goal.id !== id
        );


    saveData();


    renderAll();

}


/* =========================================================
   20. DAILY STREAK
========================================================= */

function updateStreak() {

    const activeDates =
        Object.keys(
            data.activity
        ).filter(
            date => {

                const activity =
                    data.activity[date];

                return (
                    activity.studyHours > 0 ||
                    activity.problems > 0 ||
                    activity.goals > 0
                );

            }
        );


    activeDates.sort();


    let currentStreak = 0;


    let checkDate =
        new Date();


    while (true) {

        const key =
            formatDate(checkDate);


        if (
            activeDates.includes(key)
        ) {

            currentStreak++;

            checkDate.setDate(
                checkDate.getDate() - 1
            );

        }

        else {

            break;

        }

    }


    let longestStreak = 0;

    let temporaryStreak = 0;


    for (
        let i = 0;
        i < activeDates.length;
        i++
    ) {

        if (i === 0) {

            temporaryStreak = 1;

        }

        else {

            const previous =
                new Date(
                    activeDates[i - 1]
                );

            const current =
                new Date(
                    activeDates[i]
                );


            const difference =
                (
                    current -
                    previous
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                );


            if (
                difference === 1
            ) {

                temporaryStreak++;

            }

            else {

                temporaryStreak = 1;

            }

        }


        longestStreak =
            Math.max(
                longestStreak,
                temporaryStreak
            );

    }


    document.getElementById(
        "currentStreak"
    ).textContent =
        currentStreak;


    document.getElementById(
        "longestStreak"
    ).textContent =
        longestStreak;

}


/* =========================================================
   21. CALENDAR
========================================================= */

let calendarDate =
    new Date();


function renderCalendar() {

    const grid =
        document.getElementById(
            "calendarGrid"
        );


    grid.innerHTML = "";


    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    document.getElementById(
        "calendarMonth"
    ).textContent =

        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    const weekdays = [

        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"

    ];


    weekdays.forEach(
        day => {

            const heading =
                document.createElement(
                    "div"
                );


            heading.className =
                "calendar-heading";


            heading.textContent =
                day;


            grid.appendChild(
                heading
            );

        }
    );


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* Empty cells */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "calendar-day empty";


        grid.appendChild(
            empty
        );

    }


    /* Days */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const key =
            formatDate(date);


        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day";


        if (
            key === getToday()
        ) {

            cell.classList.add(
                "today"
            );

        }


        let activity =
            data.activity[key];


        cell.innerHTML = `

            <div class="
                calendar-day-number
            ">

                ${day}

            </div>

            ${
                activity
                    ? `
                        <span
                            class="activity-dot"
                        ></span>
                      `
                    : ""
            }

        `;


        cell.onclick =
            () =>
                showDayActivity(
                    key
                );


        grid.appendChild(
            cell
        );

    }

}


/* =========================================================
   22. PREVIOUS MONTH
========================================================= */

function previousMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() - 1
    );


    renderCalendar();

}


/* =========================================================
   23. NEXT MONTH
========================================================= */

function nextMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() + 1
    );


    renderCalendar();

}


/* =========================================================
   24. SHOW DAY ACTIVITY
========================================================= */

function showDayActivity(
    date
) {

    const box =
        document.getElementById(
            "selectedDay"
        );


    const activity =
        data.activity[date];


    if (!activity) {

        box.innerHTML = `

            <strong>
                ${date}
            </strong>

            <br>

            No activity recorded.

        `;

        return;

    }


    box.innerHTML = `

        <strong>
            ${date}
        </strong>

        <br>

        📚 Study Hours:
        ${activity.studyHours}

        <br>

        💻 Problems:
        ${activity.problems}

        <br>

        🎯 Goals Completed:
        ${activity.goals}

    `;

}


/* =========================================================
   25. ANALYTICS - CHARTS
========================================================= */

let subjectChart;

let activityChart;


function renderCharts() {

    renderSubjectChart();

    renderActivityChart();

}


/* =========================================================
   26. SUBJECT CHART
========================================================= */

function renderSubjectChart() {

    const canvas =
        document.getElementById(
            "subjectChart"
        );


    if (subjectChart) {

        subjectChart.destroy();

    }


    subjectChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels:
                        data.subjects.map(
                            subject =>
                                subject.name
                        ),

                    datasets: [

                        {

                            data:
                                data.subjects.map(
                                    subject =>
                                        subject.progress
                                )

                        }

                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}


/* =========================================================
   27. ACTIVITY CHART
========================================================= */

function renderActivityChart() {

    const canvas =
        document.getElementById(
            "activityChart"
        );


    if (activityChart) {

        activityChart.destroy();

    }


    const dates =
        getLastSevenDays();


    const studyHours =
        dates.map(
            date => {

                return data.activity[
                    date
                ]
                    ? data.activity[
                        date
                    ].studyHours
                    : 0;

            }
        );


    const problems =
        dates.map(
            date => {

                return data.activity[
                    date
                ]
                    ? data.activity[
                        date
                    ].problems
                    : 0;

            }
        );


    activityChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels:
                        dates.map(
                            date =>
                                date.substring(
                                    5
                                )
                        ),

                    datasets: [

                        {

                            label:
                                "Study Hours",

                            data:
                                studyHours,

                            tension:
                                0.3

                        },


                        {

                            label:
                                "Problems Solved",

                            data:
                                problems,

                            tension:
                                0.3

                        }

                    ]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {

                            beginAtZero:
                                true

                        }

                    }

                }

            }

        );

}


/* =========================================================
   28. PERSONALIZED RECOMMENDATIONS
========================================================= */

function generateRecommendations() {

    const box =
        document.getElementById(
            "recommendations"
        );


    const recommendations = [];


    /* Find weakest subject */

    const sortedSubjects =
        [...data.subjects].sort(
            (a, b) =>
                a.progress -
                b.progress
        );


    if (
        sortedSubjects.length > 0
    ) {

        const weakest =
            sortedSubjects[0];


        recommendations.push(

            `Focus more on <strong>
            ${weakest.name}
            </strong>. Your current progress is
            ${weakest.progress}%.`

        );

    }


    /* Coding recommendation */

    const solved =
        data.codingProblems.filter(
            problem =>
                problem.status ===
                "Solved"
        );


    const easy =
        solved.filter(
            problem =>
                problem.difficulty ===
                "Easy"
        ).length;


    const medium =
        solved.filter(
            problem =>
                problem.difficulty ===
                "Medium"
        ).length;


    const hard =
        solved.filter(
            problem =>
                problem.difficulty ===
                "Hard"
        ).length;


    if (
        easy >= medium + 3
    ) {

        recommendations.push(

            "💻 You are solving many Easy problems. Try 2 Medium problems this week."

        );

    }


    if (
        medium >= hard + 3
    ) {

        recommendations.push(

            "🔥 Your Medium practice is good. Slowly start adding Hard problems."

        );

    }


    /* Study recommendation */

    if (
        data.studyHours < 5
    ) {

        recommendations.push(

            "📚 Try to reach at least 1 hour of focused study today."

        );

    }


    /* Streak recommendation */

    const streak =
        calculateCurrentStreak();


    if (
        streak === 0
    ) {

        recommendations.push(

            "🔥 Start your streak today by completing one study or coding activity."

        );

    }


    if (
        streak >= 7
    ) {

        recommendations.push(

            "🏆 Amazing! You have maintained a 7+ day streak."

        );

    }


    box.innerHTML = `

        <ul>

            ${recommendations.map(
                item =>
                    `<li>${item}</li>`
            ).join("")}

        </ul>

    `;

}


/* =========================================================
   29. DARK MODE
========================================================= */

function toggleDarkMode() {

    data.darkMode =
        !data.darkMode;


    saveData();


    applyDarkMode();

}


function applyDarkMode() {

    if (
        data.darkMode
    ) {

        document.body.classList.add(
            "dark"
        );


        document.getElementById(
            "themeButton"
        ).textContent =
            "☀️ Light Mode";

    }

    else {

        document.body.classList.remove(
            "dark"
        );


        document.getElementById(
            "themeButton"
        ).textContent =
            "🌙 Dark Mode";

    }

}


/* =========================================================
   30. BROWSER NOTIFICATIONS
========================================================= */

function enableNotifications() {

    if (
        !("Notification" in window)
    ) {

        alert(
            "Your browser does not support notifications."
        );

        return;

    }


    Notification.requestPermission()
        .then(
            permission => {

                if (
                    permission ===
                    "granted"
                ) {

                    new Notification(
                        "⚡ PrepTrack",
                        {

                            body:
                                "Notifications enabled! Keep working toward your placement goal 🚀"

                        }
                    );


                    showNotification(
                        "🔔 Notifications enabled!"
                    );

                }

                else {

                    showNotification(
                        "Notification permission was not granted."
                    );

                }

            }
        );

}


/* =========================================================
   31. DAILY REMINDER
========================================================= */

function checkDailyReminder() {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return;

    }


    const today =
        getToday();


    const activity =
        data.activity[today];


    const hasActivity =
        activity &&
        (
            activity.studyHours > 0 ||
            activity.problems > 0 ||
            activity.goals > 0
        );


    if (!hasActivity) {

        setTimeout(
            () => {

                new Notification(
                    "🔥 PrepTrack Reminder",
                    {

                        body:
                            "You haven't recorded today's preparation yet. Keep your streak alive!"

                    }
                );

            },
            3000
        );

    }

}


/* =========================================================
   32. NOTIFICATION BOX
========================================================= */

function showNotification(
    message
) {

    const box =
        document.getElementById(
            "notificationBox"
        );


    box.textContent =
        message;


    box.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            box.classList.add(
                "hidden"
            );

        },
        2500
    );

}


/* =========================================================
   33. DATE FUNCTIONS
========================================================= */

function getToday() {

    return formatDate(
        new Date()
    );

}


function formatDate(
    date
) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


/* =========================================================
   34. LAST 7 DAYS
========================================================= */

function getLastSevenDays() {

    const dates = [];


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        dates.push(
            formatDate(date)
        );

    }


    return dates;

}


/* =========================================================
   35. CALCULATE STREAK
========================================================= */

function calculateCurrentStreak() {

    let streak = 0;


    const date =
        new Date();


    while (true) {

        const key =
            formatDate(date);


        const activity =
            data.activity[key];


        if (
            activity &&
            (
                activity.studyHours > 0 ||
                activity.problems > 0 ||
                activity.goals > 0
            )
        ) {

            streak++;


            date.setDate(
                date.getDate() - 1
            );

        }

        else {

            break;

        }

    }


    return streak;

}


/* =========================================================
   36. ESCAPE HTML
   Prevents unsafe HTML from user input
========================================================= */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   37. AUTOMATIC LOGIN
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            data.username !== ""
        ) {

            document
                .getElementById(
                    "loginScreen"
                )
                .classList.add(
                    "hidden"
                );


            document
                .getElementById(
                    "app"
                )
                .classList.remove(
                    "hidden"
                );


            initializeDashboard();

        }

    }
);


/* =========================================================
   38. DAILY REMINDER CHECK
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            checkDailyReminder,
            1500
        );

    }
);