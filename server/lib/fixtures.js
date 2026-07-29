'use strict';

/**
 * Realistic fixture content for the seeder.
 *
 * The original mock route filled every field with `faker.lorem` — listings
 * titled "voluptas cum nulla eveniet vitae" in cities like "Cartwrightchester".
 * Fine for exercising the schema, useless for looking at: you cannot tell a
 * broken layout from a working one when nothing on screen means anything, and
 * a screenshot of lorem ipsum is not a demo.
 *
 * So this is synthetic data written to read like the real market — the sort of
 * posting you'd see on Daywork 123, Yotspot, or a crew agency board. Nothing
 * here is copied from a real advert and no real vessel, person, agency, or
 * contact detail appears: the vessel names are invented, the addresses are
 * example.com, and the phone numbers are in the reserved 555 range.
 *
 * What makes it read as genuine is the vocabulary, not the prose:
 *
 *   - Positions the industry actually posts (Chief Stewardess, Bosun, Sole
 *     Engineer, Chase Boat Captain) rather than generic job titles.
 *   - The hiring hubs — Fort Lauderdale, Antibes, Palma, Viareggio — and the
 *     seasonal pattern of Caribbean winters and Mediterranean summers.
 *   - The certificates that gate a real application: STCW Basic Safety
 *     Training, ENG1 medical, Yachtmaster Offshore, AEC, a B1/B2 for US waters.
 *   - Package language crew actually negotiate: rotation, longevity bonus,
 *     MLC-compliant contract, salary DOE.
 */

/** Vessel names, invented. Any resemblance to a real yacht is coincidental. */
var VESSELS = [
    { name: 'M/Y Meridian Rose', length: 54, type: 'Motor', build: 'Feadship' },
    { name: 'M/Y Astral Quay', length: 42, type: 'Motor', build: 'Benetti' },
    { name: 'S/Y Northern Compass', length: 38, type: 'Sail', build: 'Perini Navi' },
    { name: 'M/Y Pelagic Star', length: 72, type: 'Motor', build: 'Lürssen' },
    { name: 'M/Y Halcyon Drift', length: 33, type: 'Motor', build: 'Sunseeker' },
    { name: 'S/Y Windward Ledger', length: 46, type: 'Sail', build: 'Royal Huisman' },
    { name: 'M/Y Copper Harbour', length: 28, type: 'Motor', build: 'Princess' },
    { name: 'M/Y Lantern Bay', length: 60, type: 'Motor', build: 'Amels' },
    { name: 'M/Y Saltmarsh', length: 24, type: 'Sportfish', build: 'Viking' },
    { name: 'M/Y Ironwood', length: 47, type: 'Motor', build: 'Heesen' }
];

/** Where crew are actually hired, with the country the app stores. */
var PORTS = [
    { locality: 'Fort Lauderdale', administrativeArea: 'Florida', country: 'United States', coordinates: [-80.1373, 26.1224] },
    { locality: 'Antibes', administrativeArea: "Provence-Alpes-Côte d'Azur", country: 'France', coordinates: [7.1251, 43.5804] },
    { locality: 'Palma de Mallorca', administrativeArea: 'Balearic Islands', country: 'Spain', coordinates: [2.6502, 39.5696] },
    { locality: 'Monaco', administrativeArea: 'Monaco', country: 'Monaco', coordinates: [7.4246, 43.7384] },
    { locality: 'Viareggio', administrativeArea: 'Tuscany', country: 'Italy', coordinates: [10.2504, 43.8664] },
    { locality: 'Newport', administrativeArea: 'Rhode Island', country: 'United States', coordinates: [-71.3128, 41.4901] },
    { locality: 'Road Town', administrativeArea: 'Tortola', country: 'British Virgin Islands', coordinates: [-64.6208, 18.4286] },
    { locality: 'Golfe-Juan', administrativeArea: "Provence-Alpes-Côte d'Azur", country: 'France', coordinates: [7.0736, 43.5646] },
    { locality: 'Palm Beach', administrativeArea: 'Florida', country: 'United States', coordinates: [-80.0364, 26.7056] },
    { locality: 'Auckland', administrativeArea: 'Auckland', country: 'New Zealand', coordinates: [174.7633, -36.8485] }
];

/**
 * Job postings. `position`, `jobType` and `vesselType` must stay inside the
 * enums in server/config/values.js — the model rejects anything else.
 */
var JOB_LISTINGS = [
    {
        title: 'Chief Stewardess — 54m M/Y, Med season then Caribbean',
        position: 'Steward',
        jobType: 'Yacht',
        description:
            'Private/charter 54m looking for an experienced Chief Stewardess to lead a team of four. ' +
            'Med season out of Antibes from May, yard period in September, then a transatlantic crossing ' +
            'and a Caribbean winter. Silver service, wine knowledge and a genuine eye for detail expected; ' +
            'the owner is aboard roughly ten weeks a year and the standard does not drop when they are not. ' +
            'Minimum three years on vessels 40m+, two of them in a senior interior role. ' +
            'STCW and ENG1 current. B1/B2 required for the winter programme. Salary DOE, MLC contract, ' +
            'full medical after probation.',
        vessel: 0,
        port: 1,
        languages: ['English', 'French']
    },
    {
        title: 'Bosun — 42m M/Y, rotational 3:1',
        position: 'Deckhand',
        jobType: 'Yacht',
        description:
            'Bosun required for a busy 42m running a full charter calendar. Reporting to the Chief Officer, ' +
            'you own the exterior: teak, paint and varnish schedules, tender and toy maintenance, and running ' +
            'the deck team during guest operations. Tenders are a 7m Williams and a 5m chase RIB, so a ' +
            'Powerboat Level 2 and real handling hours matter more than paperwork here. ' +
            'Yachtmaster Offshore preferred. 3:1 rotation, flights covered, longevity bonus at 24 months.',
        vessel: 1,
        port: 2,
        languages: ['English']
    },
    {
        title: 'Sole Engineer — 33m M/Y, Bahamas programme',
        position: 'Engineer',
        jobType: 'Yacht',
        description:
            'Sole Engineer wanted for a 33m running a private Bahamas and Florida programme, roughly ' +
            '500 engine hours a year. MCA AEC or Y4 as a minimum; hands-on with MTU mains, Onan gensets, ' +
            'Seakeeper and a watermaker. You will manage the yard period at the end of the season and hold ' +
            'the planned maintenance system yourself, so organisation counts as much as the wrenching. ' +
            'Rotation negotiable for the right candidate. Fort Lauderdale based.',
        vessel: 4,
        port: 0,
        languages: ['English']
    },
    {
        title: 'Chef — 72m M/Y, 18 crew and up to 12 guests',
        position: 'Chef',
        jobType: 'Yacht',
        description:
            'Head Chef for a 72m with a demanding charter schedule. Two galleys, a sous chef and a crew cook ' +
            'reporting to you. Guest side is modern Mediterranean with regular dietary requirements — ' +
            'gluten free, plant based, and a standing kosher request from one repeat charter group. ' +
            'Crew mess is your responsibility too and the crew notice when it is an afterthought. ' +
            'Land-based fine dining background welcome but you must have done at least one full season afloat. ' +
            'Provisioning budget is yours to manage.',
        vessel: 3,
        port: 4,
        languages: ['English', 'Italian']
    },
    {
        title: 'Deckhand/Divemaster — 46m S/Y, Pacific crossing',
        position: 'Deckhand',
        jobType: 'Yacht',
        description:
            'Sailing yacht heading Panama to French Polynesia in the spring, then a season in the South ' +
            'Pacific. Looking for a deckhand with a PADI Divemaster or above to run the dive programme ' +
            'alongside normal deck duties. Real sailing experience required — this is a working rig, not a ' +
            'motorsailer, and you will stand watches. Compressor and nitrox handling a plus. ' +
            'Long trip: applicants who cannot commit to eight months should not apply.',
        vessel: 5,
        port: 9,
        languages: ['English']
    },
    {
        title: 'Second Stewardess — 60m M/Y, service focused',
        position: 'Steward',
        jobType: 'Yacht',
        description:
            'Second Stewardess for a 60m with a strong interior team and low turnover. Service-weighted role: ' +
            'you will run breakfast and lunch service and support formal dinners, with laundry and cabins ' +
            'shared across the team. Barista skills and floristry very welcome. ' +
            'One full season minimum on a vessel over 40m. WSET Level 1 or above is a genuine advantage — ' +
            'the boat runs a serious cellar and the Chief Stew will expect you to talk about it.',
        vessel: 7,
        port: 3,
        languages: ['English', 'Spanish']
    },
    {
        title: 'Captain — 28m M/Y, private owner, Balearics',
        position: 'Captain',
        jobType: 'Yacht',
        description:
            'Private 28m seeking a Captain for a settled Balearics programme with occasional trips to the ' +
            'Costa Brava and Sardinia. Master 200GT or Yachtmaster Offshore with commercial endorsement. ' +
            'Owner is a hands-on boater and often drives; you will need to be comfortable handing over the ' +
            'helm and equally comfortable saying no when the weather says no. ' +
            'Crew of three including yourself. This is a long-term seat — the last Captain stayed nine years.',
        vessel: 6,
        port: 2,
        languages: ['English', 'Spanish']
    },
    {
        title: 'Mate — 47m M/Y, charter, Med summer',
        position: 'Deckhand',
        jobType: 'Yacht',
        description:
            'Mate/Chief Officer for a 47m charter yacht based between Golfe-Juan and Porto Cervo. ' +
            'OOW 3000 required, Master 500 preferred. Watchkeeping, passage planning, ISM and safety drills, ' +
            'and running the deck crew of three when the Captain is off. ' +
            'Charter experience is essential — the difference between a private and a charter week is the ' +
            'entire job. Rotation available after the first full season.',
        vessel: 9,
        port: 7,
        languages: ['English', 'French']
    },
    {
        title: 'Chase Boat Captain — sportfish support, Bahamas',
        position: 'Captain',
        jobType: 'Yacht',
        description:
            'Running a 24m sportfish as chase and support for a larger programme. Fishing background ' +
            'essential: you will rig, run the cockpit and put guests on fish. Bahamas and Abacos in winter, ' +
            'Northeast canyons in summer. USCG 100 Ton Master or equivalent, plus a solid record of ' +
            'offshore days. This suits someone who wants to fish for a living and is not precious about ' +
            'washing the boat afterwards.',
        vessel: 8,
        port: 0,
        languages: ['English']
    },
    {
        title: 'Marina Dockmaster — south Florida',
        position: 'Administration',
        jobType: 'Marina',
        description:
            'Full-service marina looking for a Dockmaster to run daily operations across 180 slips with ' +
            'megayacht capacity to 60m. Berth assignments, dockhand scheduling, fuel operations, and the ' +
            'first call when something goes wrong at 0300. Prior yacht crew experience is a real advantage — ' +
            'captains can tell in one radio call whether you have run a boat. ' +
            'Shoreside role, Monday to Friday with weekend cover on rotation.',
        vessel: null,
        port: 0,
        languages: ['English', 'Spanish']
    },
    {
        title: 'Yacht Broker — sales, Fort Lauderdale office',
        position: 'Broker',
        jobType: 'Office',
        description:
            'Brokerage house seeking an experienced sales broker for the 25–45m segment. ' +
            'Book of business preferred but we will consider a strong ex-Captain making the move ashore, ' +
            'which is where most of our best brokers came from. Commission structure with a draw for the ' +
            'first year. Boat show attendance expected — Fort Lauderdale, Palm Beach, Monaco, Düsseldorf.',
        vessel: null,
        port: 0,
        languages: ['English']
    },
    {
        title: 'Marine Diesel Mechanic — shoreside service, Palma',
        position: 'Mechanic',
        jobType: 'Technician',
        description:
            'Service company covering the Balearic fleet needs a diesel mechanic for MAN, MTU and Caterpillar ' +
            'mains plus Kohler and Onan gensets. Mix of scheduled servicing, yard-period overhauls and ' +
            'callouts across Palma, Port Adriano and Ibiza. ' +
            'Manufacturer certification preferred; a clean licence and your own hand tools expected. ' +
            'Shoreside hours, occasional sea trials.',
        vessel: null,
        port: 2,
        languages: ['English', 'Spanish']
    },
    {
        title: 'Solo Stewardess — 24m M/Y, private, Newport summer',
        position: 'Steward',
        jobType: 'Yacht',
        description:
            'Small private programme, crew of two, looking for a solo stew for the New England summer. ' +
            'Interior, laundry, provisioning and simple cooking when the chef is off — the owner eats ' +
            'plainly and well and is not looking for foam. ' +
            'Ideal for a second-season stew who wants autonomy and time on the water rather than a big ' +
            'team and a rigid hierarchy. Newport based May to October, winter layup in Rhode Island.',
        vessel: 8,
        port: 5,
        languages: ['English']
    },
    {
        title: 'Deck/Engineer — 38m S/Y, dual role',
        position: 'Engineer',
        jobType: 'Yacht',
        description:
            'Dual-role Deck/Engineer for a 38m sailing yacht cruising the Caribbean in winter and the Med ' +
            'in summer. AEC minimum, comfortable with a Northern Lights genset, hydraulic winches and ' +
            'a captive reel system. You will stand watches and be part of the sail handling team — this is ' +
            'not an engine-room-only seat. Small crew, everyone does everything, no passengers.',
        vessel: 2,
        port: 6,
        languages: ['English']
    },
    {
        title: 'Carpenter/Shipwright — refit yard, Viareggio',
        position: 'Carpenter',
        jobType: 'Technician',
        description:
            'Refit yard seeking a shipwright for interior joinery and exterior teak on vessels 30–80m. ' +
            'Veneer work, solid timber, and full teak deck replacements. ' +
            'You will work to drawings and to a finish that survives an owner walking the boat with a torch. ' +
            'Italian helpful but not required — the yard floor runs in English. ' +
            'Contract to permanent for the right hands.',
        vessel: null,
        port: 4,
        languages: ['English', 'Italian']
    }
];

/** Crew résumé postings — the other side of the board. */
var CREW_LISTINGS = [
    {
        title: 'Chief Stewardess — 9 years, 40–80m, Med & Caribbean',
        name: 'Imogen Hartley',
        position: 'Steward',
        jobType: 'Yacht',
        description:
            'Nine seasons interior, the last four as Chief Stew on vessels between 45m and 78m, ' +
            'both private and heavy charter. Built and trained interior teams of up to six. ' +
            'WSET Level 2, silver service, comfortable running a provisioning budget and a cellar. ' +
            'Looking for a long-term Chief Stew seat on 50m+ with rotation. ' +
            'STCW and ENG1 current, B1/B2 valid, references from three previous Captains available.',
        port: 1,
        languages: ['English', 'French']
    },
    {
        title: 'Chief Engineer Y3 — 6 years, 50–90m motor',
        name: 'Tomasz Wierzbicki',
        position: 'Engineer',
        jobType: 'Yacht',
        description:
            'Y3 with six years on motor yachts from 50m to 90m, currently Second Engineer on a 78m and ' +
            'ready to step up. Strong on MTU and Caterpillar mains, Naiad stabilisers, and full PMS ' +
            'implementation — I rebuilt the maintenance system on my last two boats. ' +
            'Managed a 14-week yard period in Barcelona as the engineering lead. ' +
            'Seeking Chief Engineer on 60m+, rotational preferred. Available from March.',
        port: 2,
        languages: ['English', 'German', 'Russian']
    },
    {
        title: 'Chef — land-based Michelin background, 3 seasons afloat',
        name: 'Élodie Rousseau',
        position: 'Chef',
        jobType: 'Yacht',
        description:
            'Trained in Lyon, four years in a one-star kitchen before moving afloat in 2022. ' +
            'Three full seasons as sole chef on 40–55m, cooking for up to 12 guests and 9 crew. ' +
            'Modern Mediterranean and Japanese, confident with plant-based and allergen-restricted menus — ' +
            'I would rather be told about the dietary requirement than discover it at service. ' +
            'Looking for a busy charter boat where the food actually matters. Available immediately.',
        port: 3,
        languages: ['English', 'French', 'Italian']
    },
    {
        title: 'Bosun — 5 years deck, Yachtmaster Offshore',
        name: 'Cal Merrick',
        position: 'Deckhand',
        jobType: 'Yacht',
        description:
            'Five years on deck, the last two as Bosun on a 48m charter yacht. ' +
            'Yachtmaster Offshore commercially endorsed, PADI Divemaster, Powerboat Level 2, ' +
            'and a lot of tender hours in genuinely bad weather. ' +
            'Ran paint and varnish schedules and trained three deckhands from green to competent. ' +
            'Looking for Mate on 50m+ with a route to OOW, or Bosun on a larger programme. ' +
            'Happy with a long crossing.',
        port: 0,
        languages: ['English']
    },
    {
        title: 'Second Stewardess — 2 seasons, service and detail',
        name: 'Petra Novakova',
        position: 'Steward',
        jobType: 'Yacht',
        description:
            'Two full seasons interior on 40m and 52m motor yachts, most recently Second Stew running ' +
            'breakfast and lunch service for 10 guests. Barista trained, floristry from a previous life in ' +
            'events, and genuinely fast at laundry — which nobody puts on a CV and every Chief Stew asks about. ' +
            'STCW, ENG1, food hygiene Level 2. Looking to move up to Second on a 60m+ or stay Second and ' +
            'learn from a Chief Stew worth learning from.',
        port: 4,
        languages: ['English', 'German', 'Russian']
    }
];

module.exports = {
    VESSELS: VESSELS,
    PORTS: PORTS,
    JOB_LISTINGS: JOB_LISTINGS,
    CREW_LISTINGS: CREW_LISTINGS
};
