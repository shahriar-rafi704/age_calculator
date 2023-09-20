const ageGroups = [
  { name: "Child", minAge: 0, maxAge: 12 },
  { name: "Teenager", minAge: 13, maxAge: 19 },
  { name: "Adult", minAge: 20, maxAge: 64 },
  { name: "Senior", minAge: 65, maxAge: Infinity },
];

const calculateAge = (birthDetails, currentYear, currentMonth, currentDate) => {
  let years = currentYear - birthDetails.year;
  let months, days;

  if (
    currentMonth < birthDetails.month ||
    (currentMonth === birthDetails.month && currentDate < birthDetails.date)
  ) {
    years--;

    if (currentMonth < birthDetails.month) {
      months = 12 - (birthDetails.month - currentMonth);
    } else {
      months = 11;
    }

    if (currentDate < birthDetails.date) {
      const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const daysInLastMonth = getDaysInMonth(lastMonth, currentYear);
      days = daysInLastMonth - (birthDetails.date - currentDate);
    } else {
      days = currentDate - birthDetails.date;
    }
  } else {
    months = currentMonth - birthDetails.month;
    days = currentDate - birthDetails.date;
  }

  return { years, months, days };
};

const getDaysInMonth = (month, year) => {
  const isLeapYear =
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return daysInMonth[month - 1];
};

const isFutureDate = (
  birthDetails,
  currentYear,
  currentMonth,
  currentDate
) => {
  return (
    birthDetails.year > currentYear ||
    (birthDetails.year === currentYear &&
      (birthDetails.month > currentMonth ||
        (birthDetails.month === currentMonth &&
          birthDetails.date > currentDate)))
  );
};

const getAgeGroup = (age) => {
  for (const group of ageGroups) {
    if (age >= group.minAge && age <= group.maxAge) {
      return group.name;
    }
  }
  return "Unknown";
};

const calculateTotalDaysAlive = (birthDate, currentDate) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((currentDate - birthDate) / oneDay));
};

const calculateLeapYears = (birthDate, currentDate) => {
  let leapYearCount = 0;
  for (let year = birthDate.getFullYear(); year <= currentDate.getFullYear(); year++) {
    if (isLeapYear(year)) {
      leapYearCount++;
    }
  }
  return leapYearCount;
};

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const displayResult = (years, months, days, ageGroup) => {
  document.getElementById("years").textContent = years;
  document.getElementById("months").textContent = months;
  document.getElementById("days").textContent = days;
  document.getElementById("age-group").textContent = ageGroup;
};

const displayStatistics = (totalDaysAlive, leapYears) => {
  document.getElementById("total-days-alive").textContent = totalDaysAlive.toLocaleString();
  document.getElementById("leap-years").textContent = leapYears.toLocaleString();
};

const shareOnFacebook = (age, totalDaysAlive, leapYears) => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    window.location.href
  )}`;
  window.open(url, "_blank");
};

const shareOnTwitter = (age, totalDaysAlive, leapYears) => {
  const text = `Hey!!! I'm ${age} years old, and I've lived for ${totalDaysAlive} days also experienced ${leapYears} leap years. Check out my age statistics!!`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, "_blank");
};
document.getElementById("share-facebook").addEventListener("click", () => {
  const years = document.getElementById("years").textContent;
  const totalDaysAlive = document.getElementById("total-days-alive").textContent;
  const leapYears = document.getElementById("leap-years").textContent;
  shareOnFacebook(years, totalDaysAlive, leapYears);
});
document.getElementById("share-twitter").addEventListener("click", () => {
  const years = document.getElementById("years").textContent;
  const totalDaysAlive = document.getElementById("total-days-alive").textContent;
  const leapYears = document.getElementById("leap-years").textContent;
  shareOnTwitter(years, totalDaysAlive, leapYears);
});
document.getElementById("planet-select-header").addEventListener("click", () => {
  const selectOptions = document.getElementById("planet-select-options");
  const customSelect = document.querySelector(".custom-select");

  if (selectOptions.style.display === "block") {
    selectOptions.style.display = "none";
    customSelect.classList.remove("open");
  } else {
    selectOptions.style.display = "block";
    customSelect.classList.add("open");
  }
});
window.addEventListener("click", (event) => {
  const customSelect = document.querySelector(".custom-select");
  const selectOptions = document.getElementById("planet-select-options");

  if (!customSelect.contains(event.target)) {
    selectOptions.style.display = "none";
    customSelect.classList.remove("open");
  }
});
document.getElementById("calc-age-btn").addEventListener("click", () => {
  const today = new Date();
  const inputDate = new Date(document.getElementById("date-input").value);
  const birthDetails = {
    date: inputDate.getDate(),
    month: inputDate.getMonth() + 1,
    year: inputDate.getFullYear(),
  };
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  if (isFutureDate(birthDetails, currentYear, currentMonth, currentDate)) {
    alert("Not Born Yet");
    displayResult("-", "-", "-", "Not Born Yet");
    displayStatistics("-", "-");
    return;
  }

  const { years, months, days } = calculateAge(
    birthDetails,
    currentYear,
    currentMonth,
    currentDate
  );
  const ageGroup = getAgeGroup(years);
  displayResult(years, months, days, ageGroup);

  const totalDaysAlive = calculateTotalDaysAlive(inputDate, today);
  const leapYears = calculateLeapYears(inputDate, today);
  displayStatistics(totalDaysAlive.toLocaleString(), leapYears.toLocaleString());

  const selectedPlanets = Array.from(
    document.querySelectorAll("#planet-select-options input:checked")
  ).map((input) => input.value);

  displayAgeOnPlanets(years, selectedPlanets);
});
const displayAgeOnPlanets = (earthYears, planets) => {
  const ageOnPlanets = {};

  const planetYearRatios = {
    earth: 1,
    mercury: 0.2408467, 
    venus: 0.61519726, 
    mars: 1.8808158,
    jupiter: 11.862,
    saturn: 29.4571,
    uranus: 84.016846,
    neptune: 164.79132,
  };
  planets.forEach((planet) => {
    const ageOnPlanet = earthYears / planetYearRatios[planet];
    ageOnPlanets[planet] = ageOnPlanet.toFixed(2);
  });
  const ageOnPlanetsDiv = document.getElementById("age-on-planets");
  ageOnPlanetsDiv.innerHTML = "";

  for (const planet of planets) {
    const age = ageOnPlanets[planet];
    const planetName = getPlanetDisplayName(planet);
    const ageDiv = document.createElement("div");
    ageDiv.innerHTML = `<p>Age on ${planetName}:</p><span>${age} years</span>`;
    ageOnPlanetsDiv.appendChild(ageDiv);
  }
};
const getPlanetDisplayName = (planet) => {
  switch (planet) {
    case "earth":
      return "Earth";
    case "mercury":
      return "Mercury";
    case "venus":
      return "Venus";
    case "mars":
      return "Mars";
    case "jupiter":
      return "Jupiter";
    case "saturn":
      return "Saturn";
    case "uranus":
      return "Uranus";
    case "neptune":
      return "Neptune";
    default:
      return planet;
  }
};