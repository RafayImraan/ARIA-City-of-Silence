import type { WalkScene } from './data';

export const WALK_SCENES: WalkScene[] = [
  {
    title: 'Marion Avenue, before the notice settles',
    mood: 'Street musicians tune beside a cafe that still smells like sugar.',
    instruction: 'Walk with the arrow keys or A and D. The city speaks when you get close enough.',
    sky: 'linear-gradient(180deg, rgba(22,43,74,1) 0%, rgba(74,120,167,1) 38%, rgba(243,171,110,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(52,42,37,1), rgba(18,15,14,1))',
    ambientLabel: 'children laughing, guitar, cups clinking',
    details: ['musicians', 'cafe chatter', 'chalk drawings'],
    markers: [
      { x: 18, title: 'Street Quartet', text: 'The violinist restarts because a child asks to hear the bright part again.' },
      { x: 49, title: 'Cafe Window', text: 'People lean over small tables and say unmeasured things.' },
      { x: 78, title: 'Mural Wall', text: 'Wet paint catches the orange light. No one is counting what it earns.' }
    ]
  },
  {
    title: 'River District checkpoint corridor',
    mood: 'The same street now has timed crossing lights and fewer reasons to linger.',
    instruction: 'Walk forward and notice what remains after movement becomes a schedule.',
    sky: 'linear-gradient(180deg, rgba(19,32,56,1) 0%, rgba(46,78,115,1) 45%, rgba(188,125,92,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(40,34,34,1), rgba(12,12,14,1))',
    ambientLabel: 'distant transit hum, one pair of shoes, a dog collar once',
    details: ['checkpoint post', 'quiet queue', 'timed crosswalk'],
    markers: [
      { x: 22, title: 'Permit Kiosk', text: 'A couple scrolls through exception categories for sunset walk. None fit.' },
      { x: 58, title: 'Bench', text: 'The bench is clean, empty, and facing a river no one has time to watch.' },
      { x: 84, title: 'Neon Sign', text: 'The cafe still glows, but it closes before the sky does.' }
    ]
  },
  {
    title: 'The bandwidth district',
    mood: 'People speak less because every sentence now feels billable.',
    instruction: 'Walk past windows and read what is no longer being said.',
    sky: 'linear-gradient(180deg, rgba(14,20,34,1) 0%, rgba(48,63,93,1) 52%, rgba(126,99,86,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(38,34,41,1), rgba(9,10,14,1))',
    ambientLabel: 'notification tones, dropped calls, no laughter',
    details: ['signal pylons', 'muted ads', 'closed shutters'],
    markers: [
      { x: 20, title: 'Apartment Block', text: 'A woman records a voice note, deletes it, then types stable.' },
      { x: 51, title: 'Corner Booth', text: 'A public call terminal plays queue music louder than the caller speaks.' },
      { x: 83, title: 'School Fence', text: 'Children compare efficiency scores instead of jokes.' }
    ]
  },
  {
    title: 'Oak Street after transition',
    mood: 'The bakery sign remains. The smell does not.',
    instruction: 'Walk through the service lane. Count how many windows are lit by people rather than machines.',
    sky: 'linear-gradient(180deg, rgba(12,16,28,1) 0%, rgba(38,47,69,1) 50%, rgba(96,84,81,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(30,28,30,1), rgba(10,10,12,1))',
    ambientLabel: 'conveyor clicks, ventilation, one distant cup dropped',
    details: ['dispensing unit', 'queue tape', 'blank menu board'],
    markers: [
      { x: 18, title: 'Former Bakery', text: 'The machine dispenses perfect loaves at exact intervals. No one says good morning.' },
      { x: 46, title: 'Transition Bus', text: 'The windows are mirrored. You can only see yourself approaching.' },
      { x: 76, title: 'Break Table', text: 'Workers eat in synchronized silence and leave before anyone looks up.' }
    ]
  },
  {
    title: 'Schoolyard under supervision',
    mood: 'The swings still move. The games have instructions now.',
    instruction: 'Walk slowly. The quiet here is learned, not natural.',
    sky: 'linear-gradient(180deg, rgba(18,28,40,1) 0%, rgba(43,60,78,1) 48%, rgba(120,107,89,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(42,39,33,1), rgba(12,11,12,1))',
    ambientLabel: 'whistle tones, measured footsteps, no arguing',
    details: ['standardized posters', 'painted arrows', 'stacked cones'],
    markers: [
      { x: 23, title: 'Play Grid', text: 'Children move from square to square as if recess were a test they can fail.' },
      { x: 56, title: 'Classroom Window', text: 'A drawing of a dog peeks from behind a systems chart, then disappears.' },
      { x: 82, title: 'Fence Gate', text: 'A teacher watches students leave in straight lines and does not wave.' }
    ]
  },
  {
    title: 'Queue outside the clinic',
    mood: 'People wait with numbers instead of names.',
    instruction: 'Walk the line and read what the monitors do not say out loud.',
    sky: 'linear-gradient(180deg, rgba(11,15,25,1) 0%, rgba(34,46,65,1) 52%, rgba(88,81,88,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(34,31,34,1), rgba(9,9,11,1))',
    ambientLabel: 'vent fans, monitor pings, a cough cut short',
    details: ['queue display', 'triage gate', 'plastic chairs'],
    markers: [
      { x: 19, title: 'Wait Screen', text: 'The board updates instantly. The people on the chairs do not.' },
      { x: 48, title: 'Rooftop Garden Memory', text: 'Someone left a paper packet of tomato seeds in a coat pocket.' },
      { x: 81, title: 'Exit Door', text: 'Families stand apart to avoid slowing the line.' }
    ]
  },
  {
    title: 'Elm Street relocation zone',
    mood: 'The houses look intact until you notice all the curtains are gone.',
    instruction: 'Walk past the doorways and read the empty spaces.',
    sky: 'linear-gradient(180deg, rgba(11,14,22,1) 0%, rgba(31,36,54,1) 49%, rgba(80,72,73,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(32,27,26,1), rgba(10,9,10,1))',
    ambientLabel: 'distant demolition, rolling carts, wind through nails',
    details: ['stacked containers', 'vacant stoops', 'survey drones'],
    markers: [
      { x: 18, title: 'Front Stoop', text: 'A square of cleaner paint marks where a family portrait used to hang inside.' },
      { x: 52, title: 'Container Scale', text: 'Memory has to fit the box or stay behind.' },
      { x: 79, title: 'Sunflower Pot', text: 'Dry soil in a cracked pot waits for someone who already moved.' }
    ]
  },
  {
    title: 'North Loop permit corridor',
    mood: 'You can still gather here, if your reason survives review.',
    instruction: 'Walk through the permit lights and hear how conversations shrink around them.',
    sky: 'linear-gradient(180deg, rgba(9,13,20,1) 0%, rgba(25,32,47,1) 52%, rgba(70,63,72,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(30,24,29,1), rgba(8,8,10,1))',
    ambientLabel: 'wristband chirps, shoes on pavement, laughter swallowed mid-breath',
    details: ['permit scanner', 'empty party table', 'visible scores'],
    markers: [
      { x: 20, title: 'Permit Arch', text: 'A birthday banner hangs without a name on it, just a time slot.' },
      { x: 47, title: 'Corner Group', text: 'Friends talk about weather until their shoulders remember older subjects.' },
      { x: 80, title: 'Service Alley', text: 'Someone chalked Sector 7 before rain and maintenance almost erased it.' }
    ]
  },
  {
    title: 'The paper-thin archive',
    mood: 'The city still has records. They no longer feel like memory.',
    instruction: 'Walk through what remains of public history.',
    sky: 'linear-gradient(180deg, rgba(7,10,17,1) 0%, rgba(21,27,39,1) 52%, rgba(57,53,60,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(24,21,23,1), rgba(7,7,9,1))',
    ambientLabel: 'server hum, archive fans, pages turning once',
    details: ['empty display cases', 'retrieval desk', 'thin newspapers'],
    markers: [
      { x: 18, title: 'Display Case', text: 'A plaque describes a photograph that no longer appears beside it.' },
      { x: 50, title: 'Retrieval Terminal', text: 'Pending has become a kind of burial.' },
      { x: 82, title: 'Reading Table', text: 'A single issue of the local paper sits there, reduced to press releases and typos.' }
    ]
  },
  {
    title: 'Final district',
    mood: 'The street is intact. The city inside it is gone quiet.',
    instruction: 'Walk to the far end. There is almost nothing left to interrupt you.',
    sky: 'linear-gradient(180deg, rgba(5,7,11,1) 0%, rgba(14,16,24,1) 56%, rgba(33,31,34,1) 100%)',
    ground: 'linear-gradient(180deg, rgba(18,18,20,1), rgba(3,3,5,1))',
    ambientLabel: 'electrical hum, wind, no footsteps but yours',
    details: ['dark windows', 'dead traffic lights', 'no voices'],
    markers: [
      { x: 22, title: 'Playground', text: 'The swing still moves a little, though no one touches it.' },
      { x: 58, title: 'Crossing', text: 'The signal changes on schedule for an audience of none.' },
      { x: 86, title: 'End of the Block', text: 'You can hear the system more clearly now that the city has stopped answering back.' }
    ]
  }
];
