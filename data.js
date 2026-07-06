/* =========================================================
   Släktgolfen — all historik på ett ställe.
   Nytt år? Lägg till en rad i EDITIONS och uppdatera NEXT.
   ========================================================= */

// Spelade upplagor (äldst först). venue: null = okänd/ej dokumenterad.
const EDITIONS = [
  { year: 2005, winner: 'Christian Rosencranz', venue: null },
  { year: 2006, winner: 'Janna Linglöf', venue: null },
  { year: 2007, winner: 'Tobias Borelius', venue: null },
  { year: 2008, winner: 'Christian Rosencranz', venue: null },
  { year: 2009, winner: 'Janna Linglöf', venue: null },
  { year: 2011, winner: 'Andreas Danielsson', venue: null },
  { year: 2012, winner: 'Gösta Danielsson', venue: null },
  { year: 2013, winner: 'Andreas Danielsson', venue: null },
  { year: 2015, winner: 'Åsa Lind', venue: null },
  { year: 2017, winner: 'Olle Borelius', venue: null },
  { year: 2018, winner: 'Andreas Danielsson', venue: null },
  { year: 2020, winner: 'Susanna Jungblom', venue: null },
  { year: 2022, winner: 'Åsa Lind', venue: null },
  { year: 2024, winner: 'Olle Borelius', venue: null },
  { year: 2025, winner: 'Åsa Lind', venue: 'Nybro Golfklubb' },
  { year: 2026, winner: 'Max Linglöf', venue: 'Lycke Golf & Country Club', score: '40 poäng' },
];

// Nästa upplaga. date = golfdagen, partyDate = festen kvällen före.
const NEXT = {
  year: 2027,
  venue: 'Kalmar Golfklubb',
  venueShort: 'Kalmar GK',
  date: '2027-07-04',
  partyDate: '2027-07-03',
};

// ===== Härledd statistik =====
const REIGNING = EDITIONS[EDITIONS.length - 1];

function titleCounts() {
  const counts = {};
  EDITIONS.forEach((e) => { counts[e.winner] = (counts[e.winner] || 0) + 1; });
  return counts;
}

// Titelnummer per upplaga (1:a, 2:a, 3:e ...)
function withOrdinals() {
  const seen = {};
  return EDITIONS.map((e) => {
    seen[e.winner] = (seen[e.winner] || 0) + 1;
    return { ...e, titleNum: seen[e.winner] };
  });
}

function ordinalSv(n) {
  return n + (n === 1 || n === 2 ? ':a' : ':e');
}
