// Embark India blog — sample posts. Each post: slug, title, category, tags,
// colleges (drives the college carousel filter), date, author, readMins,
// excerpt, body (HTML). Replace/extend freely — the blog pages render this list.
const POSTS = [
  {
    slug: 'nirf-2026-what-actually-moved',
    title: 'NIRF 2026: what actually moved, and what it means for your list',
    category: 'News',
    tags: ['news', 'rankings', 'NIRF'],
    colleges: ['IIM Ahmedabad', 'IIM Bangalore', 'ISB Hyderabad'],
    date: '2026-07-04',
    author: 'Narenther',
    readMins: 5,
    excerpt: 'The top three did not move — they almost never do. The story is in ranks 15 to 40, where two big jumps and one quiet slide should change a few application lists.',
    body: `
      <p>Every NIRF release produces the same headlines about the same three colleges. Ignore them: the top of the table is frozen, and your decision probably does not live there anyway. The useful information is in the middle of the table, where movement is real and reasons matter.</p>
      <h2>Jumps deserve suspicion before applause</h2>
      <p>When a college climbs eight places, find out which parameter moved. A jump driven by placement outcomes and faculty additions is a real signal. A jump driven by perception score — a survey — is marketing with a rank attached. NIRF publishes the parameter split; read it before you reorder your list.</p>
      <h2>Slides are slower than reputations</h2>
      <p>A college that slips three years in a row is telling you something the brochure will not. Reputation decays slower than quality — which means the rank often falls <em>after</em> the batch experience already has. Cross-check recent placement medians against two years ago before you trust the brand memory.</p>
      <h2>What to do with this</h2>
      <p>Rebuild your college bands once a year, after NIRF and after placement reports — not after a coaching institute's "top colleges" poster. And if a college you care about moved sharply either way this year, that is exactly the kind of question worth asking someone who studied there.</p>
    `
  },
  {
    slug: 'reading-placement-reports',
    title: 'How to read a placement report without getting fooled',
    category: 'Placements',
    tags: ['placements', 'guides'],
    colleges: ['IIM Indore', 'XLRI Jamshedpur'],
    date: '2026-07-01',
    author: 'Narenther',
    readMins: 6,
    excerpt: 'Average CTC is the most quoted and least useful number in Indian MBA marketing. Here is what to look at instead, and the questions colleges hope you never ask.',
    body: `
      <p>Every MBA brochure leads with one number: average CTC. It is also the easiest number to dress up. If you are comparing colleges on averages alone, you are comparing marketing departments, not placement cells.</p>
      <h2>Median beats average, every time</h2>
      <p>One ₹45 lakh international offer can drag a batch average up by a lakh or more. The median — the middle student's offer — cannot be moved by outliers. If a college publishes only the average and not the median, that silence is information. NIRF filings require more disclosure than brochures do, so when in doubt, pull the college's NIRF data and compare it against the marketing PDF.</p>
      <h2>Percent placed hides its own definition</h2>
      <p>"98% placed" means nothing until you know the denominator. Placed out of the full batch, or out of "students who opted for placements"? The second definition quietly removes everyone who dropped out of the process — often the students who struggled. Ask for the batch size and the number of students who sat for placements as two separate numbers.</p>
      <h2>The recruiter list ages fast</h2>
      <p>A logo wall says a company recruited <em>at some point</em>. What you want is the last two seasons: which companies came, how many offers each made, and for what roles. Three offers from a marquee consulting firm looks very different from thirty offers from BPO operations roles — and both can hide behind the same logo wall.</p>
      <h2>Questions worth emailing the placement cell</h2>
      <p>What was the median CTC for the most recent completed season? How many students registered for placements versus batch strength? What were the top five recruiters by number of offers? A placement cell that answers plainly is telling you something about the college. One that responds with a brochure is telling you something too.</p>
    `
  },
  {
    slug: 'cat-percentile-vs-cutoff',
    title: 'CAT percentile vs cutoff: what the numbers actually mean',
    category: 'Exam prep',
    tags: ['exam prep', 'admissions', 'CAT'],
    colleges: ['IIM Ahmedabad', 'IIM Bangalore', 'FMS Delhi'],
    date: '2026-06-24',
    author: 'Narenther',
    readMins: 5,
    excerpt: 'A 95 percentile does not mean what most aspirants think it means. Understanding sectionals, category cutoffs, and the difference between cutoff and final admit score.',
    body: `
      <p>Every year, students with 95+ overall percentiles are stunned to receive no calls, while someone at 92 collects three. The confusion usually comes down to three things nobody explains early enough.</p>
      <h2>Sectional cutoffs cut first</h2>
      <p>Most institutes apply sectional cutoffs before the overall one. A 99 overall with a 70 in VARC can be eliminated before your overall percentile is ever considered. When you plan your prep, your weakest section is not a weakness — it is the gate.</p>
      <h2>The published cutoff is the floor, not the door</h2>
      <p>"Cutoff 90" means applications below 90 were not considered. The <em>actual</em> admitted cohort often sits well above it, because the shortlist is built from a composite score — CAT plus academics, work experience, and diversity weightings that differ per institute. Two colleges with identical cutoffs can have completely different real bars.</p>
      <h2>Old cutoffs are weather reports</h2>
      <p>Cutoffs move with applicant volume, seat changes, and exam difficulty. Use the last three years as a range, not last year as a promise. And remember that a new IIM's cutoff dropping is not a quality signal by itself — read it together with placement medians and batch size.</p>
      <p>The practical move: build your college list in three bands — realistic, stretch, and safe — using three-year cutoff ranges and <em>your</em> category, not the general one quoted in headlines.</p>
    `
  },
  {
    slug: 'tier2-colleges-that-punch-up',
    title: 'Tier 2 MBA colleges that punch above their weight',
    category: 'Rankings',
    tags: ['rankings', 'guides', 'tier 2'],
    colleges: ['IIM Indore', 'SPJIMR Mumbai', 'XLRI Jamshedpur'],
    date: '2026-06-15',
    author: 'Narenther',
    readMins: 7,
    excerpt: 'Beyond the IIM acronym there is a band of colleges where the fees are saner, the cohorts hungrier, and specific recruiters quietly loyal. How to spot them.',
    body: `
      <p>The Indian MBA conversation is monopolised by twenty brand names, but the placement data tells a more interesting story: a band of institutes where outcomes per rupee of fees beat several colleges ranked above them.</p>
      <h2>What "punching up" actually looks like</h2>
      <p>Look for three signals. First, a placement median within striking distance of colleges charging ten lakhs more. Second, recruiter loyalty — the same companies returning year after year for the same roles, which means the college is a known quantity in that corridor. Third, a visible specialisation: a campus known for supply chain, or analytics, or sales-heavy FMCG roles, rather than "general management" as a shrug.</p>
      <h2>The fee math nobody does out loud</h2>
      <p>A ₹12 lakh programme with a ₹11 lakh median and a ₹24 lakh programme with a ₹14 lakh median are not far apart once you finance the fees with a loan. Compute the payback period — months of post-tax salary to clear the education loan — and the rankings table rearranges itself in surprising ways.</p>
      <h2>Where mentorship changes the equation</h2>
      <p>The honest complication: at this band, outcomes vary much more <em>within</em> a college than between colleges. The student who does two live projects and hunts a summer conversion has a very different exit from the batch average. That is exactly where guidance from someone who attended — not a brochure — earns its keep.</p>
      <p>We will publish structured profiles for this band of colleges — cutoffs, fees, medians, recruiter lists, all with sources and dates — as the college hub comes online. The blog and those profiles will link both ways.</p>
    `
  },
  {
    slug: 'wat-pi-what-panels-listen-for',
    title: 'WAT-PI season: what interview panels actually listen for',
    category: 'Admissions',
    tags: ['admissions', 'interviews'],
    colleges: ['IIM Calcutta', 'FMS Delhi'],
    date: '2026-06-05',
    author: 'Narenther',
    readMins: 4,
    excerpt: 'Panels are not testing your opinions. They are testing whether you can hold a thought under pressure. A short field guide from the other side of the table.',
    body: `
      <p>Most WAT-PI prep is content prep: current affairs, "tell me about yourself", the same forty questions. Useful, but panels are rarely evaluating your content. They are evaluating what happens to your thinking when it is pushed.</p>
      <h2>The follow-up is the real question</h2>
      <p>The first question is a doorway. Whatever you answer, a good panellist takes the opposite side and presses. Candidates who treat this as an attack defend; candidates who treat it as a collaboration explore. The second group gets the offer. Practise having your favourite opinion dismantled without changing what you believe mid-sentence just to please the room.</p>
      <h2>Specifics are oxygen</h2>
      <p>"I led a team" is dead air. "Three of us, eleven weeks, one missed deadline that I caused" is a conversation. Panels lean forward at numbers, names, and failures owned plainly — because those cannot be rehearsed from a coaching handout.</p>
      <h2>The WAT is a thinking sample, not an essay</h2>
      <p>Twenty minutes, one page. Structure beats vocabulary: a clear position, two supporting arguments, one honest acknowledgement of the other side, a conclusion that follows. Examiners read hundreds of these; the one that is easy to follow wins.</p>
      <p>Mock interviews with people who have sat on real panels remain the highest-leverage prep there is — which is exactly why mock interviews are on the Embark India roadmap.</p>
    `
  },
  {
    slug: 'from-82-percentile-to-fms',
    title: 'From an 82 percentile mock to FMS Delhi: a working plan, not a miracle',
    category: 'Success stories',
    tags: ['success stories', 'CAT', 'FMS'],
    colleges: ['FMS Delhi'],
    date: '2026-05-28',
    author: 'Narenther',
    readMins: 5,
    excerpt: 'Ninety days out, her mocks said 82 percentile. She closed at 97.8 and converted FMS. The plan was boring, specific, and completely copyable.',
    body: `
      <p>Success stories usually hide the mechanics behind the emotion. This one is worth telling because the mechanics were the whole story: no heroic streaks, no 14-hour days — a working professional with three evenings a week and a plan she actually followed.</p>
      <h2>The audit came before the effort</h2>
      <p>Her first move was not more mocks — it was a two-hour autopsy of the last three. The finding: quant accuracy was fine but attempt count was low, and VARC was bleeding marks on reading-comprehension inference questions specifically. That converted "study harder" into two named problems.</p>
      <h2>One fix per fortnight</h2>
      <p>Each fortnight targeted exactly one weakness. Quant attempt-count went first: timed sectionals with a forced-skip rule — fifteen seconds of no progress means move. VARC inference came second, twenty passages a week with answers argued out loud. Nothing else changed. The mocks climbed almost reluctantly: 82, 85, 89, 91.</p>
      <h2>The last month was rehearsal, not learning</h2>
      <p>The final four weeks added nothing new. Same slot as the real exam, same breakfast, full mock, full analysis, sleep. Exam day, in her words, "felt like the eleventh rehearsal." She scored 97.8, cleared the FMS cutoff, and converted the interview by talking plainly about her failure-and-fix cycle — the very thing this plan produced.</p>
      <p>The copyable part is not her percentile. It is the shape: audit first, one named fix at a time, rehearsal at the end.</p>
    `
  }
];
