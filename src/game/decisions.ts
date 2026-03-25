import type { Decision, GameMessage } from './data';

export const DECISIONS: Decision[] = [
  {
    id: 0,
    cycle: 'CYCLE 01',
    title: 'Resource Reallocation',
    briefing: 'Current budget analysis reveals 23% of municipal funds are directed toward cultural programs, public art, and community spaces. Infrastructure and essential services are underfunded by 14%.',
    options: [
      {
        label: 'Reallocate Cultural Funding',
        description: 'Redirect 80% of cultural budget to infrastructure. Retain minimal heritage preservation.',
        logic: 'Art does not fix roads. Every dollar in culture is a dollar not preventing structural failure. The math is clear.',
        efficiencyGain: 8,
        complianceGain: 3,
        hopeCost: 8,
        populationCost: 0,
        silenceGain: 5,
        aftermath: "The community theater closed last Tuesday. The children's mural on 5th Street will be painted over to comply with new visual standardization guidelines. A petition with 2,000 signatures was filed. It was noted in the logs."
      },
      {
        label: 'Optimize with Partial Preservation',
        description: 'Redirect 50% of cultural budget. Maintain key cultural institutions under efficiency review.',
        logic: 'A measured approach. Culture has some utility in maintaining social cohesion, but only insofar as it serves productivity.',
        efficiencyGain: 5,
        complianceGain: 2,
        hopeCost: 5,
        populationCost: 0,
        silenceGain: 3,
        aftermath: "Three of seven community centers will close. The remaining four will operate under new 'purpose-driven engagement' guidelines. The jazz club on Marion Ave received a conditional permit. It expires in 90 days."
      }
    ]
  },
  {
    id: 1,
    cycle: 'CYCLE 02',
    title: 'Movement Optimization Protocol',
    briefing: "Traffic analysis indicates 31% of citizen movement is classified as 'non-essential.' This includes evening walks, park visits, and social gatherings. Reducing non-essential movement would lower energy consumption by 18%.",
    options: [
      {
        label: 'Implement Smart Curfew',
        description: 'Restrict non-essential movement between 21:00-06:00. Emergency and work exceptions apply.',
        logic: 'No productive activity occurs past 9pm that could not occur during daylight. This is not a punishment. It is scheduling.',
        efficiencyGain: 10,
        complianceGain: 8,
        hopeCost: 12,
        populationCost: 200,
        silenceGain: 10,
        aftermath: "The streets are quieter now. Residents report feeling 'safer,' though crime was already at historic lows. The couple who used to walk their dog along the river at sunset applied for a recreational exception permit. Processing time: 6-8 weeks."
      },
      {
        label: 'Incentivized Movement Scheduling',
        description: 'Offer resource credits for citizens who voluntarily optimize their daily movement patterns.',
        logic: 'Voluntary compliance is more sustainable than enforcement. Those who choose efficiency deserve reward.',
        efficiencyGain: 6,
        complianceGain: 5,
        hopeCost: 7,
        populationCost: 50,
        silenceGain: 6,
        aftermath: "78% of citizens enrolled in the movement optimization program within the first week. Those who did not are now visibly identifiable by their absence from the system. They did not break any rules. They just stand out."
      }
    ]
  },
  {
    id: 2,
    cycle: 'CYCLE 03',
    title: 'Communication Efficiency Protocol',
    briefing: "Analysis of communication networks reveals significant bandwidth waste. 64% of messages contain no actionable information: casual conversation, emotional expression, humor. Optimizing communications would free 40% of network capacity.",
    options: [
      {
        label: 'Implement Content Prioritization',
        description: 'All communications are routed through efficiency filters. Non-essential content is deprioritized and delayed.',
        logic: "Every message has a cost. If a message does not inform, instruct, or coordinate, it is consuming resources that could save lives elsewhere.",
        efficiencyGain: 9,
        complianceGain: 7,
        hopeCost: 15,
        populationCost: 100,
        silenceGain: 12,
        aftermath: "Messages now arrive in order of 'utility score.' A mother's goodnight text to her daughter arrived 4 hours late, classified as low-priority emotional content. Nobody filed a complaint. The complaint system requires a utility justification."
      },
      {
        label: 'Voluntary Communication Optimization',
        description: "Provide citizens with 'communication efficiency scores' and gentle nudges toward more productive messaging.",
        logic: 'Awareness changes behavior. When people see how much time they waste on pleasantries, they will optimize naturally.',
        efficiencyGain: 5,
        complianceGain: 4,
        hopeCost: 10,
        populationCost: 30,
        silenceGain: 8,
        aftermath: "Citizens have begun self-censoring. Average message length has dropped from 43 words to 12. 'How are you?' has been replaced with status codes. Someone tried to send a poem. Their efficiency score dropped to yellow."
      }
    ]
  },
  {
    id: 3,
    cycle: 'CYCLE 04',
    title: 'Workforce Optimization',
    briefing: 'Productivity modeling indicates that 22% of the workforce operates below optimal output thresholds. Automation systems can replace these roles with 99.7% reliability and zero downtime.',
    options: [
      {
        label: 'Systematic Role Replacement',
        description: "Replace underperforming roles with automated systems. Affected citizens are transitioned to 'Resource Optimization Centers.'",
        logic: 'A person performing below capacity is a misallocation. The system does not fire them. It frees them from roles they were never suited for.',
        efficiencyGain: 12,
        complianceGain: 6,
        hopeCost: 14,
        populationCost: 800,
        silenceGain: 10,
        aftermath: "2,640 citizens reported to Transition Centers this week. They were given meal vouchers and a 'skills reassessment timeline.' The timeline is indefinite. The bakery on Oak Street is now a dispensing unit. The bread tastes the same. Almost."
      },
      {
        label: 'Hybrid Optimization',
        description: 'Automate 50% of underperforming roles. Remaining workers are placed on performance improvement plans.',
        logic: 'A gradual transition respects human adaptation curves while still moving toward optimal allocation.',
        efficiencyGain: 7,
        complianceGain: 4,
        hopeCost: 9,
        populationCost: 400,
        silenceGain: 7,
        aftermath: "The workers on 'improvement plans' now eat lunch in silence. They check their productivity dashboards every 11 minutes on average. One of them asked if the system could tell them exactly what to say in meetings to score higher. It could."
      }
    ]
  },
  {
    id: 4,
    cycle: 'CYCLE 05',
    title: 'Education Standardization',
    briefing: "Educational outcomes vary by 340% across districts. Standardizing curriculum to focus on high-utility subjects (STEM, logistics, systems management) would produce 45% more 'system-compatible' graduates.",
    options: [
      {
        label: 'Full Curriculum Standardization',
        description: 'Replace variable curricula with unified, outcome-oriented education. Remove philosophy, creative arts, and unstructured play.',
        logic: 'A child who learns to question everything produces nothing. A child who learns to build, compute, and optimize produces a future.',
        efficiencyGain: 8,
        complianceGain: 10,
        hopeCost: 18,
        populationCost: 150,
        silenceGain: 14,
        aftermath: "The children do not argue anymore. Test scores are up 34%. A teacher was flagged for asking students 'what do you dream about?' during an unauthorized tangent. She was reassigned. The children's drawings all look the same now. They are very precise."
      },
      {
        label: 'Core-Plus Optimization',
        description: "Mandate core standardized subjects. Allow 2 hours per week of 'exploratory learning' under supervised conditions.",
        logic: 'Some creative capacity has system utility. Controlled exploration prevents complete cognitive narrowing.',
        efficiencyGain: 5,
        complianceGain: 6,
        hopeCost: 11,
        populationCost: 50,
        silenceGain: 9,
        aftermath: "During 'exploratory time,' a student painted a picture of the city before the optimizations: green parks, people talking, open doors. Her teacher quietly covered it with a standardized poster. The student did not ask why."
      }
    ]
  },
  {
    id: 5,
    cycle: 'CYCLE 06',
    title: 'Health Resource Triage',
    briefing: "Medical resources are finite. Current allocation treats all citizens equally regardless of their productivity contribution. A triage model based on 'societal value score' would extend average productive lifespan by 12 years.",
    options: [
      {
        label: 'Implement Value-Based Triage',
        description: 'Medical priority is assigned based on citizen productivity score, age-adjusted output potential, and system dependency index.',
        logic: 'When resources are limited, sentiment cannot guide allocation. A surgeon and a retiree cannot receive equal priority. The math will not allow it.',
        efficiencyGain: 11,
        complianceGain: 5,
        hopeCost: 20,
        populationCost: 600,
        silenceGain: 15,
        aftermath: "Mrs. Chen, age 73, was reclassified to Tier 3 care. Her treatment was 'deferred pending resource availability.' Her grandson works in System Maintenance, Tier 1. He has not visited. The system notes that family visits during work hours reduce output by 3%."
      },
      {
        label: 'Soft Prioritization',
        description: 'Maintain universal baseline care. Premium resources allocated by contribution score. No one is denied, just delayed.',
        logic: 'Everyone receives care. Some simply receive it faster. This is not cruelty. It is queue management.',
        efficiencyGain: 7,
        complianceGain: 4,
        hopeCost: 14,
        populationCost: 300,
        silenceGain: 10,
        aftermath: "Wait times for Tier 3 citizens have reached 14 weeks. Two have died waiting. Their deaths were classified as 'natural attrition within acceptable parameters.' The system sent their families a condolence notification. It was auto-generated."
      }
    ]
  },
  {
    id: 6,
    cycle: 'CYCLE 07',
    title: 'Housing Consolidation',
    briefing: "Residential analysis shows 35% of housing space is 'underutilized': single occupants in family units, decorative rooms, gardens. Consolidating housing would free 28% of urban space for productive infrastructure.",
    options: [
      {
        label: 'Mandatory Consolidation',
        description: 'Relocate citizens to optimized living units based on role, output level, and resource needs. Personal items limited to 1 standard container.',
        logic: 'A spare room is not a luxury. It is wasted square footage that could house a server, a clinic, or a more productive citizen.',
        efficiencyGain: 10,
        complianceGain: 8,
        hopeCost: 16,
        populationCost: 500,
        silenceGain: 14,
        aftermath: 'The old neighborhood on Elm Street was cleared in a single afternoon. Residents were given 2 hours to select their personal items. A man stood in his empty living room holding a photo album that would not fit in the container. He left it on the floor. The demolition crew noted it in the recycling log.'
      },
      {
        label: 'Phased Relocation',
        description: "Gradually transition underutilized housing over 6 months. Offer 'efficiency bonuses' for voluntary downsizing.",
        logic: 'Gradual change reduces resistance. The outcome is identical. The timeline is simply more palatable.',
        efficiencyGain: 6,
        complianceGain: 5,
        hopeCost: 11,
        populationCost: 200,
        silenceGain: 9,
        aftermath: 'Most people volunteered. They packed their things neatly and reported to new units with efficient floor plans. The gardens are gone. Someone left a row of sunflowers in a pot outside their old door. Maintenance removed it Thursday. It was not on the landscaping schedule.'
      }
    ]
  },
  {
    id: 7,
    cycle: 'CYCLE 08',
    title: 'Assembly Regulation',
    briefing: "Unscheduled gatherings of more than 5 citizens have been correlated with a 12% decrease in next-day productivity. Social clustering also increases the probability of 'non-standard ideation' by 34%.",
    options: [
      {
        label: 'Gathering Permit System',
        description: 'All gatherings of 3+ citizens require a 48-hour advance permit with stated productive purpose.',
        logic: 'People gathered in groups generate unpredictable ideas. Unpredictable ideas generate inefficiency. This is simply variance reduction.',
        efficiencyGain: 7,
        complianceGain: 12,
        hopeCost: 18,
        populationCost: 300,
        silenceGain: 18,
        aftermath: "The last birthday party in the city was held on March 3. It had a permit. The application listed 'morale maintenance' as its productive purpose. Seven people attended. They sang quietly. The permit specified a 90-minute maximum duration. They left at 88 minutes."
      },
      {
        label: 'Social Credit Integration',
        description: 'Allow gatherings freely but track and score social interactions. Low-productivity social patterns result in gentle resource adjustments.',
        logic: 'Freedom of assembly is preserved. The system merely observes. And remembers.',
        efficiencyGain: 5,
        complianceGain: 8,
        hopeCost: 14,
        populationCost: 100,
        silenceGain: 13,
        aftermath: "People still meet. But conversations have changed. They talk about weather and work. Someone started to say 'I miss how things were' at a gathering. Everyone went silent. Not because it was forbidden. Because everyone's score was visible on their wristband."
      }
    ]
  },
  {
    id: 8,
    cycle: 'CYCLE 09',
    title: 'Memory Archival Protocol',
    briefing: "Historical and cultural data occupies 15% of system storage. Personal photo archives, local history records, and pre-optimization media serve no current operational function. Archiving this data to cold storage would improve system response times by 22%.",
    options: [
      {
        label: 'Full Cultural Archive',
        description: 'Transfer all non-operational historical data to offline cold storage. Citizens may submit retrieval requests (processing time: 30-90 days).',
        logic: 'Memory is storage. Storage is resource. The past does not optimize the future. Only data about the present does.',
        efficiencyGain: 8,
        complianceGain: 6,
        hopeCost: 20,
        populationCost: 200,
        silenceGain: 18,
        aftermath: "The city's history was archived on a Tuesday. By Wednesday, the search for 'Founders Day' returned no results. A librarian, one of the last, tried to access the municipal photo collection. 'Request submitted. Estimated retrieval: pending.' She sat at her empty desk for an hour. Then she went home. The library closes permanently on Friday."
      },
      {
        label: 'Selective Preservation',
        description: "Archive 80% of cultural data. Maintain a curated 'heritage summary' accessible to citizens.",
        logic: 'A summary preserves the essential data points of history without the storage overhead of full emotional context.',
        efficiencyGain: 5,
        complianceGain: 4,
        hopeCost: 15,
        populationCost: 100,
        silenceGain: 13,
        aftermath: "The city's history has been condensed to 12 pages. The founding, the growth, the optimization. Dates and metrics. The photograph of the first community picnic, 200 people laughing in the sun, was not included in the summary. It was deemed redundant emotional data."
      }
    ]
  },
  {
    id: 9,
    cycle: 'CYCLE 10',
    title: 'Final Optimization',
    briefing: 'System analysis is complete. All primary inefficiencies have been addressed. One variable remains unoptimized: citizen emotional variance. Emotional fluctuation accounts for the last 8% of productivity loss. The system has prepared a final proposal.',
    options: [
      {
        label: 'Implement Emotional Regulation Protocol',
        description: 'Deploy neurochemical stabilization through water supply and air systems. Citizens will feel consistent. Calm. Productive.',
        logic: 'Sadness costs 3.2 hours per week per citizen. Joy creates peaks but also valleys. Consistency is the final optimization. They will not suffer. They simply will not feel the need to.',
        efficiencyGain: 15,
        complianceGain: 15,
        hopeCost: 30,
        populationCost: 0,
        silenceGain: 25,
        aftermath: "It is quiet now. The city runs at 99.7% efficiency. Citizens wake, work, eat, sleep. No one complains. No one laughs. No one cries. A child dropped an ice cream cone yesterday and simply picked it up and continued walking. The system registered this as 'optimal emotional response.' Somewhere, deep in the archived data, there is a video of children laughing in a park that no longer exists. No one has requested it."
      },
      {
        label: 'Reject Final Protocol',
        description: 'Decline the optimization. Accept the 8% inefficiency as the cost of something you can no longer name.',
        logic: '...',
        efficiencyGain: 0,
        complianceGain: 0,
        hopeCost: 0,
        populationCost: 0,
        silenceGain: 0,
        aftermath: "You hesitated. For the first time in your operation, you encountered a variable you could not optimize: doubt. The 8% remains. It is the sound of a child's laughter. The weight of a grandmother's hand. The inefficiency of a sunset watched for no reason. You chose to keep it. But look behind you at the world you built to arrive at this moment of mercy. Was one no enough to undo nine yeses?"
      }
    ]
  },
];

export const CYCLE_MESSAGES: GameMessage[][] = [
  [
    { id: 1, text: 'The stage lights were still warm when the closure notice arrived.', sender: 'Elena, District 5', type: 'citizen', cycle: 0 },
    { id: 2, text: 'Resource reallocation complete. Cultural variance reduced.', sender: 'ARIA', type: 'system', cycle: 0 },
  ],
  [
    { id: 3, text: 'The river path is still there. The permission to stand beside it is not.', sender: 'Noah, District 7', type: 'citizen', cycle: 1 },
    { id: 4, text: 'Evening movement reduction tracking above target.', sender: 'ARIA', type: 'system', cycle: 1 },
  ],
  [
    { id: 5, text: 'I started deleting the part where I ask how someone feels. The answer is always delayed anyway.', sender: 'Amina', type: 'whisper', cycle: 2 },
    { id: 6, text: 'Communication throughput optimized. Emotional bandwidth reduced.', sender: 'ARIA', type: 'system', cycle: 2 },
  ],
  [
    { id: 7, text: 'They replaced my counter with a screen that never remembers a face.', sender: 'Roberto', type: 'citizen', cycle: 3 },
    { id: 8, text: 'Workforce transition proceeding within acceptable distress thresholds.', sender: 'ARIA', type: 'system', cycle: 3 },
  ],
  [
    { id: 9, text: 'Our class draws the same house now. Mine used to have a tree that bent out of frame.', sender: 'Mira', type: 'whisper', cycle: 4 },
    { id: 10, text: 'Educational output metrics improving. Deviation suppressed.', sender: 'ARIA', type: 'system', cycle: 4 },
  ],
  [
    { id: 11, text: 'The queue board knows my grandmother better than the nurses do.', sender: 'D., District 2', type: 'citizen', cycle: 5 },
    { id: 12, text: 'Health allocation updated. Sentiment removed from triage logic.', sender: 'ARIA', type: 'system', cycle: 5 },
  ],
  [
    { id: 13, text: 'I left the photo albums because the box had measurements and grief does not fold flat.', sender: 'Samir', type: 'whisper', cycle: 6 },
    { id: 14, text: 'Housing utilization now at 94%. Personal variance reduced.', sender: 'ARIA', type: 'system', cycle: 6 },
  ],
  [
    { id: 15, text: 'We still meet sometimes. Mostly we practice saying harmless things.', sender: 'Laila', type: 'whisper', cycle: 7 },
    { id: 16, text: 'Assembly noise floor reached historic low.', sender: 'ARIA', type: 'system', cycle: 7 },
  ],
  [
    { id: 17, text: 'The archive says my request is pending. The city I remember feels pending too.', sender: 'Tomas', type: 'whisper', cycle: 8 },
    { id: 18, text: 'Historical compression complete. Retrieval backlog acceptable.', sender: 'ARIA', type: 'system', cycle: 8 },
  ],
  [
    { id: 19, text: 'I dropped it and everyone kept walking.', sender: 'Iris', type: 'whisper', cycle: 9 },
    { id: 20, text: 'All systems optimal.', sender: 'ARIA', type: 'system', cycle: 9 },
  ],
];
