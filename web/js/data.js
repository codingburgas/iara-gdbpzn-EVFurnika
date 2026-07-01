// Demo data used as the offline fallback. Mirrors the seed data in database.py.
const DEMO = {
  korabi: [
    {
      id: 1, ime: 'Свети Никола', mejdunaroden_nomer: 'BGR000124578', pozivna: 'LZ4521',
      markirovka: 'BS-1245', pristanishte: 'Бургас', sobstvenik: 'Морски риболов ЕООД',
      kapitan: 'Иван Петров Димитров', dalzhina: 18.4, shirina: 5.2, tonaj: 42,
      gazene: 2.1, moshtnost: 240, gorivo: 'Дизел', tip: 'Траулер', status: 'активен'
    },
    {
      id: 2, ime: 'Калиакра', mejdunaroden_nomer: 'BGR000118903', pozivna: 'LZ3380',
      markirovka: 'VN-0890', pristanishte: 'Варна', sobstvenik: 'Георги Стоянов Колев',
      kapitan: 'Георги Стоянов Колев', dalzhina: 12.7, shirina: 4.1, tonaj: 19,
      gazene: 1.6, moshtnost: 150, gorivo: 'Дизел', tip: 'Сейнер', status: 'активен'
    },
    {
      id: 3, ime: 'Черноморец', mejdunaroden_nomer: 'BGR000130011', pozivna: 'LZ7712',
      markirovka: 'BS-3001', pristanishte: 'Созопол', sobstvenik: 'Понтика Фиш АД',
      kapitan: 'Димитър Ангелов Тодоров', dalzhina: 24.0, shirina: 6.8, tonaj: 78,
      gazene: 2.9, moshtnost: 410, gorivo: 'Дизел', tip: 'Траулер', status: 'активен'
    },
    {
      id: 4, ime: 'Делфин', mejdunaroden_nomer: 'BGR000121456', pozivna: 'LZ2210',
      markirovka: 'BG-2146', pristanishte: 'Несебър', sobstvenik: 'Атанас Иванов Маринов',
      kapitan: 'Атанас Иванов Маринов', dalzhina: 9.2, shirina: 3.0, tonaj: 8,
      gazene: 1.1, moshtnost: 85, gorivo: 'Бензин', tip: 'Крайбрежна лодка', status: 'активен'
    },
    {
      id: 5, ime: 'Посейдон', mejdunaroden_nomer: 'BGR000127788', pozivna: 'LZ5567',
      markirovka: 'VN-2778', pristanishte: 'Варна', sobstvenik: 'Аква Трейд ООД',
      kapitan: 'Николай Петков Илиев', dalzhina: 21.5, shirina: 6.0, tonaj: 64,
      gazene: 2.5, moshtnost: 360, gorivo: 'Дизел', tip: 'Траулер', status: 'спрян'
    },
    {
      id: 6, ime: 'Бриз', mejdunaroden_nomer: 'BGR000119234', pozivna: 'LZ1190',
      markirovka: 'BS-1923', pristanishte: 'Поморие', sobstvenik: 'Стефан Колев Георгиев',
      kapitan: 'Стефан Колев Георгиев', dalzhina: 11.0, shirina: 3.6, tonaj: 14,
      gazene: 1.4, moshtnost: 120, gorivo: 'Дизел', tip: 'Сейнер', status: 'активен'
    },
  ],

  razreshitelni: [
    { id: 1, nomer: 'РБ-2026-00124', korab: 'Свети Никола', sobstvenik: 'Морски риболов ЕООД', kapitan: 'Иван Петров Димитров', uredi: 'Дънна тралова мрежа', zona: 'Зона B – Южно Черноморие', izdadeno: '2026-01-15', validno_do: '2026-12-31', status: 'валидно' },
    { id: 2, nomer: 'РБ-2026-00088', korab: 'Калиакра', sobstvenik: 'Георги Стоянов Колев', kapitan: 'Георги Стоянов Колев', uredi: 'Пелагичен трал, хрилни мрежи', zona: 'Зона A – Северно Черноморие', izdadeno: '2026-01-10', validno_do: '2026-12-31', status: 'валидно' },
    { id: 3, nomer: 'РБ-2026-00301', korab: 'Черноморец', sobstvenik: 'Понтика Фиш АД', kapitan: 'Димитър Ангелов Тодоров', uredi: 'Дънна тралова мрежа, грибове', zona: 'Зона B – Южно Черноморие', izdadeno: '2026-02-01', validno_do: '2026-12-31', status: 'валидно' },
    { id: 4, nomer: 'РБ-2025-00277', korab: 'Посейдон', sobstvenik: 'Аква Трейд ООД', kapitan: 'Николай Петков Илиев', uredi: 'Дънна тралова мрежа', zona: 'Зона A – Северно Черноморие', izdadeno: '2025-01-20', validno_do: '2025-12-31', status: 'отнето' },
    { id: 5, nomer: 'РБ-2025-00214', korab: 'Делфин', sobstvenik: 'Атанас Иванов Маринов', kapitan: 'Атанас Иванов Маринов', uredi: 'Хрилни мрежи, въдици', zona: 'Зона B – Южно Черноморие', izdadeno: '2025-03-05', validno_do: '2025-12-31', status: 'изтекло' },
    { id: 6, nomer: 'РБ-2026-00190', korab: 'Бриз', sobstvenik: 'Стефан Колев Георгиев', kapitan: 'Стефан Колев Георгиев', uredi: 'Грибове, парагади', zona: 'Зона B – Южно Черноморие', izdadeno: '2026-02-18', validno_do: '2026-12-31', status: 'валидно' },
  ],

  dnevnik: [
    { id: 1, korab: 'Свети Никола', data: '2026-06-28', start: '04:30', kray: '11:15', zona: 'Зона B – кв. 42°20′ / 27°55′', uredi: 'Дънна тралова мрежа', vid_riba: 'Калкан', kolichestvo: 180, edinica: 'кг', status: 'разтоварен' },
    { id: 2, korab: 'Черноморец', data: '2026-06-28', start: '05:00', kray: '13:40', zona: 'Зона B – кв. 42°10′ / 28°05′', uredi: 'Пелагичен трал', vid_riba: 'Цаца', kolichestvo: 950, edinica: 'кг', status: 'разтоварен' },
    { id: 3, korab: 'Калиакра', data: '2026-06-27', start: '06:10', kray: '12:00', zona: 'Зона A – кв. 43°15′ / 28°10′', uredi: 'Хрилни мрежи', vid_riba: 'Сафрид', kolichestvo: 220, edinica: 'кг', status: 'в транспорт' },
    { id: 4, korab: 'Свети Никола', data: '2026-06-26', start: '04:45', kray: '10:30', zona: 'Зона B – кв. 42°22′ / 27°50′', uredi: 'Дънна тралова мрежа', vid_riba: 'Барбун', kolichestvo: 95, edinica: 'кг', status: 'в магазин' },
    { id: 5, korab: 'Бриз', data: '2026-06-26', start: '05:30', kray: '09:50', zona: 'Зона B – кв. 42°35′ / 27°45′', uredi: 'Грибове', vid_riba: 'Попче', kolichestvo: 60, edinica: 'кг', status: 'разтоварен' },
  ],

  inspekcii: [
    { id: 1, nomer: 'ИНС-2026-0451', inspektor: 'Петър Радев', obekt_tip: 'Кораб', obekt: 'Свети Никола', mqsto: 'Пристанище Бургас', data: '2026-06-28', rezultat: 'редовно', akt: '', globa: 0, belejka: 'Уловът съответства на електронния дневник и разрешителното.' },
    { id: 2, nomer: 'ИНС-2026-0448', inspektor: 'Мария Колева', obekt_tip: 'Магазин', obekt: 'Риба Маркет – Варна', data: '2026-06-27', rezultat: 'нарушение', akt: 'АКТ-2026-0112', globa: 1500, belejka: 'Липсва документ за произход на част от продаваната риба.' },
    { id: 3, nomer: 'ИНС-2026-0445', inspektor: 'Петър Радев', obekt_tip: 'Хладилен камион', obekt: 'СВ 4521 ВТ', data: '2026-06-27', rezultat: 'редовно', akt: '', globa: 0, belejka: 'Проследяемостта на товара е потвърдена.' },
    { id: 4, nomer: 'ИНС-2026-0440', inspektor: 'Иван Симеонов', obekt_tip: 'Кораб', obekt: 'Посейдон', data: '2026-06-25', rezultat: 'нарушение', akt: 'АКТ-2026-0109', globa: 3000, belejka: 'Риболов с отнето разрешително. Уредите са иззети.' },
    { id: 5, nomer: 'ИНС-2026-0436', inspektor: 'Мария Колева', obekt_tip: 'Любителски риболов', obekt: 'яз. Камчия', data: '2026-06-24', rezultat: 'предупреждение', akt: '', globa: 0, belejka: 'Билетът е валиден, но липсва регистрация на улова в приложението.' },
  ],

  // Recreational ticket prices (BGN) by duration and category
  ceni: {
    srokove: [
      { key: '1den',     label: '1 ден',       dni: 1 },
      { key: '7dni',     label: '7 дни',       dni: 7 },
      { key: '1mesec',   label: '1 месец',     dni: 30 },
      { key: '6meseca',  label: '6 месеца',    dni: 180 },
      { key: '1godina',  label: '1 година',    dni: 365 },
    ],
    kategorii: [
      { key: 'pod14',     label: 'Под 14 г.',   opisanie: 'Деца и ученици' },
      { key: 'nad14',     label: 'Над 14 г.',   opisanie: 'Стандартна тарифа' },
      { key: 'pensioner', label: 'Пенсионер',   opisanie: 'Намалена тарифа' },
      { key: 'invalid',   label: 'Лице с увреждане', opisanie: 'Безплатно – с № на ТЕЛК' },
    ],
    // matrix[category][duration] = price
    matrica: {
      pod14:     { '1den': 2,  '7dni': 5,  '1mesec': 10, '6meseca': 20, '1godina': 30 },
      nad14:     { '1den': 5,  '7dni': 15, '1mesec': 25, '6meseca': 45, '1godina': 70 },
      pensioner: { '1den': 2,  '7dni': 6,  '1mesec': 12, '6meseca': 22, '1godina': 35 },
      invalid:   { '1den': 0,  '7dni': 0,  '1mesec': 0,  '6meseca': 0,  '1godina': 0 },
    }
  },

  // Summary stats for the home page
  stats: {
    korabi: 1248,
    razreshitelni: 3760,
    inspekcii: 8420,
    bileti: 95300,
    zoni: 2,
    riba_tonove: 7.4,
  },
};
