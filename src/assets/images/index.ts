import couplePhoto from './hero_girl_photo_1790361474971.jpg';
import romanticDinner from './romantic_dinner_1790359895232.jpg';
import sweetWalk from './sweet_walk_date_1790359908942.jpg';

export interface PhotoMemory {
  id: string;
  src: string;
  caption: string;
  dateTag: string;
  locationTag: string;
}

export const MEMORY_PHOTOS: PhotoMemory[] = [
  {
    id: 'photo_1',
    src: couplePhoto,
    caption: 'Твой самый милый и уютный образ, в который невозможно не влюбиться',
    dateTag: 'Наши тёплые дни',
    locationTag: 'Уютный вечер',
  },
  {
    id: 'photo_2',
    src: romanticDinner,
    caption: 'Наш будущий незабываемый ужин при свечах и звоне бокалов',
    dateTag: '03 октября 2026',
    locationTag: 'Панорамный ресторан',
  },
  {
    id: 'photo_3',
    src: sweetWalk,
    caption: 'Прогулка под вечерними фонарями, держась за руки',
    dateTag: 'Осенний вечер',
    locationTag: 'Огни ночного города',
  },
];
