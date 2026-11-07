# EU Product Rules

Which EU rules apply to a product, from when, and what data each one asks for: the ESPR Digital Product Passport, the battery passport, Detergents, Toy Safety, PPWR packaging, RoHS, REACH, Ecodesign, textile labelling and France's AGEC law. Every rule links to the law on EUR-Lex.

**Checker:** https://veribl.github.io/eu-product-rules/

Pick a product category (e-bike, toy, clothing, TV, detergent…) and the checker lists the rules that apply today, the ones with a passport date already set in law, and the ones still planned, with the data points each rule needs. You can link straight to a result: `?product=e-bike` (add `&fr=1` for products also sold in France).

## The data

Two JSON files, free to use under CC BY 4.0:

| File | What's in it |
| --- | --- |
| [`data/regulations.json`](data/regulations.json) | 14 rules: legal status, key date, product categories, market (EU or FR), and the data points each one asks for (required or optional, with a plain data type) |
| [`data/eu-acts.json`](data/eu-acts.json) | 24 EU acts with CELEX numbers, common names, and EUR-Lex + ELI links |

```sh
curl -s https://raw.githubusercontent.com/veribl/eu-product-rules/main/data/regulations.json \
  | jq '.regulations[] | select(.categories | index("toy")) | {name, status, keyDate}'
```

Status values:

- `in_force`: applies today (passport or not)
- `dpp_dated`: the act is adopted and fixes the date the product passport becomes mandatory
- `planned`: announced in the ESPR working plan; the act isn't adopted yet, so dates are indicative

## Rules covered

| Rule | Reference | Status | Key date |
| --- | --- | --- | --- |
| [ESPR – Digital Product Passport (framework)](https://eur-lex.europa.eu/eli/reg/2024/1781/oj) | Regulation (EU) 2024/1781 | In force | In force since 18 Jul 2024 · passport content and dates set per product group |
| [Batteries – Battery passport](https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/eu-digital-product-passport-faq-batteries_en) | Regulation (EU) 2023/1542, Art. 77 & Annex XIII | Passport date set | Passport mandatory from 18 Feb 2027 |
| [Detergents – product passport](https://eur-lex.europa.eu/eli/reg/2026/405/oj) | Regulation (EU) 2026/405 | Passport date set | Passport mandatory from 23 Sep 2029 |
| [Toys – product passport](https://eur-lex.europa.eu/eli/reg/2025/2509/oj) | Regulation (EU) 2025/2509 (Toy Safety Regulation) | Passport date set | Passport mandatory from 1 Aug 2030 |
| [ESPR – Iron & steel](https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en) | ESPR delegated act (planned) | Planned | Adoption expected Q4 2026 · passport around 2028 (indicative) |
| [ESPR – Textiles & apparel](https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en) | ESPR delegated act (planned) | Planned | Adoption expected Q3–Q4 2027 · passport 2029 at the earliest (indicative) |
| [Textile Labelling – Fibre composition](https://eur-lex.europa.eu/eli/reg/2011/1007/oj) | Regulation (EU) No 1007/2011 | In force | Applies since 8 May 2012 |
| [France AGEC – Textile product information](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045726094) | French Environment Code Art. L541-9-1 · Décret n° 2022-748 | In force | Applies since 1 Jan 2023 · companies above €10M turnover and 10,000 units in France since 1 Jan 2025 |
| [ESPR – Furniture](https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en) | ESPR delegated act (planned) | Planned | Adoption expected 2028 · passport date not set (indicative) |
| [Ecodesign – Electronic displays](https://eur-lex.europa.eu/eli/reg/2019/2021/oj) | Regulation (EU) 2019/2021 (under the Ecodesign Directive) | In force | Applies since 1 Mar 2021 · ESPR revision planned for 2027 |
| [Ecodesign – Washing machines, dishwashers, fridges](https://eur-lex.europa.eu/eli/reg/2019/2023/oj) | Regulations (EU) 2019/2023, 2019/2022 and 2019/2019 (under the Ecodesign Directive) | In force | Applies since 1 Mar 2021 · ESPR revisions planned from 2026 |
| [RoHS – Hazardous substances in electronics](https://eur-lex.europa.eu/eli/dir/2011/65/oj) | Directive 2011/65/EU | In force | In force |
| [REACH – Substances of very high concern](https://echa.europa.eu/regulations/reach/understanding-reach) | Regulation (EC) 1907/2006, Art. 33 | In force | In force |
| [PPWR – Packaging declaration of conformity](https://eur-lex.europa.eu/eli/reg/2025/40/oj) | Regulation (EU) 2025/40 | In force | Applies since 12 Aug 2026 · one declaration per packaging type |

## Where the data comes from

The data is exported from the reviewed rules catalog that [Veribl](https://veribl.com) maintains for its product passport software. It was last reviewed on October 22, 2026 against the Commission's DPP pages, the ESPR working plan (COM(2025)187), Implementing Regulation (EU) 2026/1778 on the DPP Registry, EUR-Lex and Légifrance. Every CELEX number in `eu-acts.json` was checked against the EU Publications Office.

Requirement lists are a practical subset to prepare for, not the full legal text and **not legal advice**.

## Contributing

A date moved, a delegated act was adopted, or a link broke? [Open an issue](https://github.com/veribl/eu-product-rules/issues) with a link to the official source.

## License

- Data (`data/`): [CC BY 4.0](LICENSE-DATA). Credit "EU Product Rules by Veribl".
- Code: [MIT](LICENSE)
