/**
 * news-data.js — お知らせデータ管理（localStorage）
 */

const NEWS_KEY = 'tsuoki_news';

const DEFAULT_NEWS = [
  {
    id: 'default-1',
    date: '2026-04-01',
    category: 'important',
    title: 'ゴールデンウィーク期間中の診療についてのお知らせ',
    body: '2026年のゴールデンウィーク期間（4月29日〜5月6日）の診療は以下のとおりです。\n4月29日（水・祝）、5月3日（日）〜5月6日（水・振替）は休診です。\n4月30日（木）、5月1日（金）、5月2日（土）は通常通り診療いたします。\n緊急の場合は三重県救急医療情報センター（059-224-1199）へお問い合わせください。'
  },
  {
    id: 'default-2',
    date: '2026-03-15',
    category: 'notice',
    title: '春季健診（胃カメラ・大腸カメラ）のご案内',
    body: '春の胃カメラ・大腸カメラ検査のご予約を受け付けております。\n消化器の不調が気になる方、健診未受診の方はぜひこの機会にご検討ください。\nご予約はお電話にてお問い合わせください。'
  },
  {
    id: 'default-3',
    date: '2026-02-01',
    category: 'notice',
    title: '花粉症・アレルギー性鼻炎の診療を行っております',
    body: '花粉症シーズンに向け、アレルギー性鼻炎の診察・処方を行っております。\n目のかゆみ、鼻水、くしゃみなどの症状がある方はお気軽にご来院ください。\n初診の方も歓迎いたします。'
  },
  {
    id: 'default-4',
    date: '2026-01-04',
    category: 'hours',
    title: '2026年 新年の診療開始について',
    body: '明けましておめでとうございます。\n2026年は1月4日（日）より通常通り診療を開始いたします。\n本年も地域の皆さまの健康を守るため、スタッフ一同精進してまいります。\nどうぞよろしくお願いいたします。'
  },
  {
    id: 'default-5',
    date: '2025-12-01',
    category: 'notice',
    title: 'インフルエンザ予防接種のご予約受付中です',
    body: '2025-2026年シーズンのインフルエンザ予防接種を実施しております。\nお電話にてご予約をお受けしております。接種料金・対象年齢など詳細はお電話にてお問い合わせください。'
  },
  {
    id: 'default-6',
    date: '2025-11-01',
    category: 'hours',
    title: '年末年始の診療日程について',
    body: '年末は12月30日（火）まで診療いたします。\n年始は2026年1月4日（日）より通常診療を再開いたします。\n12月31日〜1月3日は休診となります。ご不便をおかけしますがご了承ください。'
  }
];

function getNews() {
  const raw = localStorage.getItem(NEWS_KEY);
  if (raw) return JSON.parse(raw);
  // 初回: デフォルトデータをセット
  localStorage.setItem(NEWS_KEY, JSON.stringify(DEFAULT_NEWS));
  return DEFAULT_NEWS;
}

function saveNews(posts) {
  localStorage.setItem(NEWS_KEY, JSON.stringify(posts));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
