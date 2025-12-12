//TODO add imports if needed
//TODO doc
/**
 * The main function which calls the application. 
 * Please, add specific description here for the application purpose.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
  
    // 1. Získání pole zaměstnanců
    const employeeList = generateEmployeeData(dtoIn); 

    // 2. Výpočet statistik
    const dtoOut = getEmployeeStatistics(employeeList);
  
  return dtoOut;
}

/**
 * Please, add specific description here 
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
    let employeeCount = 0;
    let employees = []

    const ageLimits = dtoIn.age;
  
   while(employeeCount < dtoIn.count){
      const employee = employeeRandom(ageLimits);
      

      employees.push(employee);

      employeeCount++;
    };

 return employees;
};

/**
 * Počítá různé statistické údaje (průměry, mediány, četnosti úvazků) z pole zaměstnanců.
 * @param {Array} employeeList - Pole objektů obsahující data zaměstnanců.
 * @returns {object} Statistický objekt dtoOut se specifickými klíči.
 */
export function getEmployeeStatistics(employeeList) {
    const dtoOut = {};
    
//1. CELKOVÝ POČET ZAMĚSTNANCŮ (total)
    dtoOut.total = employeeList.length;

    
//2. POČET ZAMĚSTNANCŮ PODLE ÚVAZKU
    const counts = employeeList.reduce((acc, employee) => {
        const workload = employee.workload; 
        acc[workload] = (acc[workload] || 0) + 1;
        return acc;
    }, {});

    // Převedení redukovaného objektu na samostatné klíče
    dtoOut.workload10 = counts["10"] || 0;
    dtoOut.workload20 = counts["20"] || 0;
    dtoOut.workload30 = counts["30"] || 0;
    dtoOut.workload40 = counts["40"] || 0;

    
// 3. PRŮMĚR ÚVAZKŮ ŽEN (averageWomenWorkload)
    const femaleEmployees = employeeList.filter(e => e.gender === "female"); 
    
    const totalFemaleWorkload = femaleEmployees.reduce((sum, employee) => {
        return sum + employee.workload;
    }, 0); 
    
    // Výpočet průměru a zaokrouhlení na 1 desetinné místo (povolená varianta)
    const averageWomenWorkloadValue = femaleEmployees.length > 0 
        ? totalFemaleWorkload / femaleEmployees.length 
        : 0;

    dtoOut.averageWomenWorkload = Math.round(averageWomenWorkloadValue * 10) / 10;
        
        
//4. SEŘAZENÝ SEZNAM DLE ÚVAZKU (sortedByWorkload)
    // Vytvoříme KOPii pole pro řazení
    const sortedEmployees = [...employeeList].sort((a, b) => {
        return a.workload - b.workload; // Numerické řazení (nejmenší -> největší)
    });
    
    dtoOut.sortedByWorkload = sortedEmployees;

//5. MEDIÁN ÚVAZKU (medianWorkload)
    const middleIndexWorkload = Math.floor(sortedEmployees.length / 2);
    dtoOut.medianWorkload = sortedEmployees[middleIndexWorkload].workload;

    
//6. VĚKOVÉ STATISTIKY
    
    // Pole všech desetinných věků
    const ages = employeeList.map(employee => calculateAge(employee.birthdate));

    // Průměrný věk (averageAge)
    const totalAge = ages.reduce((sum, age) => sum + age, 0); 
    dtoOut.averageAge = Math.round((totalAge / ages.length) * 10) / 10; // Zaokrouhlení na 1 desetinné místo

    // Minimální a Maximální věk (minAge, maxAge) - celá čísla
    // Math.floor a Math.ceil pro celočíselný výstup
    dtoOut.minAge = Math.floor(Math.min(...ages)); 
    dtoOut.maxAge = Math.floor(Math.max(...ages)); 

    // Medián věku (medianAge)
    const sortedAges = [...ages].sort((a, b) => a - b); 
    const middleIndexAge = Math.floor(sortedAges.length / 2);
    let medianAgeValue;

    if (sortedAges.length % 2 === 0) {
        const lowerMiddle = sortedAges[middleIndexAge - 1];
        const upperMiddle = sortedAges[middleIndexAge];
        medianAgeValue = (lowerMiddle + upperMiddle) / 2;
    } else {
        medianAgeValue = sortedAges[middleIndexAge];
    }
    
    dtoOut.medianAge = Math.round(medianAgeValue); //Zaokrouhlení na celé číslo

    return dtoOut;
}


    

//VSTUPNÍ DATA

const names = {
    fNamesF:[
        "Anna", "Eliška", "Adéla", "Tereza", "Kristýna",
    "Karolína", "Klára", "Sára", "Natálie", "Nikola",
    "Barbora", "Kateřina", "Markéta", "Lucie", "Veronika",
    "Michaela", "Jana", "Šárka", "Denisa", "Alena",
    "Marie", "Zuzana", "Pavla", "Lenka", "Monika"
    ],

    lNamesF: [  "Nováková", "Svobodová", "Novotná", "Dvořáková", "Černá",
  "Procházková", "Kučerová", "Veselá", "Horáková", "Němcová",
  "Pokorná", "Marková", "Hájková", "Králová", "Jelínková",
  "Krejčová", "Růžičková", "Benešová", "Fialová", "Sedláčková",
  "Doležalová", "Zemanová", "Kolářová", "Vaňková", "Kadlecová"
    ],

    fNamesM: [
        "Jan", "Jakub", "Tomáš", "Adam", "Matěj",
    "Vojtěch", "Lukáš", "Ondřej", "Petr", "Josef",
    "David", "Daniel", "Michal", "Martin", "Šimon",
    "Tadeáš", "Filip", "Marek", "Roman", "Václav",
    "Radek", "Karel", "Jaroslav", "Patrik", "Dominik"
    ],

    lNamesM: [
         "Novák", "Svoboda", "Novotný", "Dvořák", "Černý",
  "Procházka", "Kučera", "Veselý", "Horák", "Němec",
  "Pokorný", "Marek", "Hájek", "Král", "Jelínek",
  "Krejčí", "Růžička", "Beneš", "Fiala", "Sedláček",
  "Doležal", "Zeman", "Kolář", "Vaněk", "Kadlec"
    ],
};


const workLoadOpt = [10, 20, 30, 40];


//POMOCNÉ FUNKCE 

function randomBday(minAge, maxAge) {
  const today = new Date();
  
  // Přesný výpočet v ms: 365.25 dní/rok * 24h * 60m * 60s * 1000ms
  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
  
  // 1. Nejstarší datum (T_min) = Dnes - MAXIMÁLNÍ věk (v ms)
  const minTime = today.getTime() - (maxAge * MS_PER_YEAR);

  // 2. Nejmladší datum (T_max) = Dnes - MINIMÁLNÍ věk (v ms)
  const maxTime = today.getTime() - (minAge * MS_PER_YEAR);

  // Generování náhodného timestampu
  let randomTime = minTime + Math.random() * (maxTime - minTime);

  return new Date(randomTime);
}
 

function employeeRandom(ageLimits){
    let genderOpt = ["female", "male"];
    let name = "";
    let surname = "";

    let gender = genderOpt[Math.floor(Math.random() * genderOpt.length)];

    if(gender === "female"){
        name = names.fNamesF[Math.floor(Math.random() * names.fNamesF.length)]
        surname = names.lNamesF[Math.floor(Math.random() * names.lNamesF.length)]    
    } else if(gender === "male"){
        name = names.fNamesM[Math.floor(Math.random() * names.fNamesM.length)]
        surname = names.lNamesM[Math.floor(Math.random() * names.lNamesM.length)]
        
    };

    let birthdate = randomBday(ageLimits.min, ageLimits.max);
    birthdate = birthdate.toISOString();

    let workload = workLoadOpt[Math.floor(Math.random() * workLoadOpt.length)];

    return{
        name,
        surname,
        gender,
        birthdate,
        workload

    };


};

function calculateAge(birthdate) {
    const today = new Date();
    const bday = new Date(birthdate); // Převedeme řetězec na objekt Datum
    
    // Vypočteme rozdíl v milisekundách mezi dneškem a datem narození
    const diff_ms = today.getTime() - bday.getTime(); 
    
    // Konstanta pro přepočet milisekund na roky.
    // Používáme 365.25 dní pro zohlednění přestupných let (365 + 1/4)
    const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
    
    // Věk jako desetinné číslo
    const age = diff_ms / MS_PER_YEAR;

    return age;
}
