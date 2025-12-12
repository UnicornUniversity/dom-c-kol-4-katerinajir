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
   while(employeeCount < dtoIn.count){
      const employee = employeeRandom();
      

      employees.push(employee);

      employeeCount++;
    };

 return employees;
};

/**
 * Please, add specific description here 
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employeeList){
    const dtoOut = {};
   // 1. POČET ZAMĚSTNANCŮ
    dtoOut.employeeCount = employeeList.length

    
    // 2. POČET ZAMĚSTNANCŮ PODLE ÚVAZKU
    dtoOut.workloadCounts = employeeList.reduce((acc, employee) => {
        const workload = employee.workload; 
        
        // Zvýšíme počítadlo pro daný workload o 1.
        acc[workload] = (acc[workload] || 0) + 1;
        
        return acc;

    }, {});

    
    
    // 3. PRŮMĚR ÚVAZKŮ ŽEN
    const femaleEmployees = employeeList.filter(e => e.gender === "female"); 
    // Vytvoříme pole, kde jsou JEN ženy.
    
    const totalFemaleWorkload = femaleEmployees.reduce((sum, employee) => {
        // sum je akumulátor, který sčítá úvazky.
        return sum + employee.workload;
    }, 0); // sum začíná na 0.
    
    // Průměr = Součet / Počet
    dtoOut.averageFemaleWorkload = 
        femaleEmployees.length > 0 
        ? totalFemaleWorkload / femaleEmployees.length 
        : 0;
        // Kontrola: Pokud není žádná žena, vracíme 0, abychom neřeli nulou.

        
        
    // 4. SEŘAZENÝ SEZNAM DLE ÚVAZKU (od nejmenšího po největší)
    
    // Vytvoříme KOPii pole pomocí spread operátoru [...], abychom nezměnili původní employeeList!
    const sortedEmployees = [...employeeList].sort((a, b) => {
        // Porovnáváme úvazek A s úvazkem B.
        // Pokud má A menší úvazek než B, výsledek bude ZÁPORNÝ, a A zůstane první.
        return a.workload - b.workload; 
    });
    
    dtoOut.sortedEmployeeListByWorkload = sortedEmployees;

    // Vytvoříme pole všech věků, kde každý prvek je desetinné číslo
const ages = employeeList.map(employee => calculateAge(employee.birthDate));

// Součet všech věků
const totalAge = ages.reduce((sum, age) => sum + age, 0); 

// Průměr a zaokrouhlení na 1 desetinné místo
dtoOut.averageAge = Math.round((totalAge / ages.length) * 10) / 10;

// Spread operátor (...) "rozloží" prvky pole 'ages' jako argumenty funkce Math.min/max
dtoOut.minAge = Math.floor(Math.min(...ages)); // Nejstarší (nejmenší věk)
dtoOut.maxAge = Math.ceil(Math.max(...ages));  // Nejmladší (největší věk)


// 1. Nejprve seřadíme pole ages (od nejmenšího po největší)
const sortedAges = [...ages].sort((a, b) => a - b); 
const middleIndex = Math.floor(sortedAges.length / 2); // Např. pro 5 prvků je index 2

let medianAge;

if (sortedAges.length % 2 === 0) {
    // Případ SUDÉHO počtu prvků (např. 10 zaměstnanců)
    // Bereme průměr ze dvou prostředních: index (N/2 - 1) a index (N/2)
    const lowerMiddle = sortedAges[middleIndex - 1];
    const upperMiddle = sortedAges[middleIndex];
    medianAge = (lowerMiddle + upperMiddle) / 2;
} else {
    // Případ LICHÉHO počtu prvků (např. 9 zaměstnanců)
    // Bereme přesně prostřední prvek
    medianAge = sortedAges[middleIndex];
}

dtoOut.medianAge = Math.round(medianAge * 10) / 10; // Zaokrouhlení na 1 desetinné místo



// 5. MEDIÁN ÚVAZKU
const workloads = employeeList.map(e => e.workload); // Pole [10, 20, 40, 30, ...]
const sortedWorkloads = workloads.sort((a, b) => a - b);

const wlMiddleIndex = Math.floor(sortedWorkloads.length / 2);
let medianWorkload;

if (sortedWorkloads.length % 2 === 0) {
    // Sudý počet
    const lowerMiddle = sortedWorkloads[wlMiddleIndex - 1];
    const upperMiddle = sortedWorkloads[wlMiddleIndex];
    medianWorkload = (lowerMiddle + upperMiddle) / 2;
} else {
    // Lichý počet
    medianWorkload = sortedWorkloads[wlMiddleIndex];
}

dtoOut.medianWorkload = medianWorkload;

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
 

function employeeRandom(){
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

    let birthDate = randomBday(dtoIn.age.min, dtoIn.age.max);

    birthDate.setUTCHours(0, 0, 0, 0);

    birthDate = birthDate.toISOString();

    let workload = workLoadOpt[Math.floor(Math.random() * workLoadOpt.length)];

    return{
        name,
        surname,
        gender,
        birthDate,
        workload

    };


};

function calculateAge(birthDate) {
    const today = new Date();
    const bday = new Date(birthDate); // Převedeme řetězec na objekt Datum
    
    // Vypočteme rozdíl v milisekundách mezi dneškem a datem narození
    const diff_ms = today.getTime() - bday.getTime(); 
    
    // Konstanta pro přepočet milisekund na roky.
    // Používáme 365.25 dní pro zohlednění přestupných let (365 + 1/4)
    const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
    
    // Věk jako desetinné číslo
    const age = diff_ms / MS_PER_YEAR;

    return age;
}
