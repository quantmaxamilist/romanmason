// Derived lists (not copy): the client's own photographs, with their real pixel sizes.
// work-01…20 are the old Gallery page's 2024 set, work-21…27 the seven added in 2025.
// `alt` text is a plain description of what the photo shows. No project names or places are claimed.

export type Photo = { id: string; w: number; h: number; alt: string };

export const work: Photo[] = [
  { id: 'work-21', w: 801, h: 602, alt: 'White rendered single-storey extension with dark roof and patio doors' },
  { id: 'work-03', w: 801, h: 602, alt: 'Rendered two-storey extension with tall arched windows' },
  { id: 'work-22', w: 640, h: 480, alt: 'Finished kitchen with dark island, marble worktop and pendant lights' },
  { id: 'work-26', w: 801, h: 602, alt: 'Rear of a rendered house with glazed gable and garden doors' },
  { id: 'work-18', w: 602, h: 802, alt: 'Finished kitchen diner with exposed beams and oak table' },
  { id: 'work-13', w: 801, h: 602, alt: 'Rendered house with arched glazed doors opening onto a stone patio' },
  { id: 'work-09', w: 801, h: 602, alt: 'Timber roof structure over red steel beams' },
  { id: 'work-02', w: 801, h: 602, alt: 'Red brick house with slate roof' },
  { id: 'work-20', w: 602, h: 802, alt: 'Finished bathroom with freestanding bath and brass-framed shower' },
  { id: 'work-08', w: 801, h: 602, alt: 'White rendered extension with sliding doors and new brick steps' },
  { id: 'work-06', w: 801, h: 602, alt: 'New slate roof with rooflight' },
  { id: 'work-19', w: 602, h: 802, alt: 'Finished living room with log burner and parquet floor' },
  { id: 'work-16', w: 801, h: 602, alt: 'Brick extension under construction on a red brick house' },
  { id: 'work-05', w: 801, h: 602, alt: 'Steel beam set into blockwork with new floor joists' },
  { id: 'work-23', w: 640, h: 480, alt: 'Finished lounge with slatted feature wall and corner sofa' },
  { id: 'work-07', w: 602, h: 802, alt: 'Fitted kitchen with pantry cupboard and built-in ovens' },
  { id: 'work-14', w: 801, h: 602, alt: 'Curved brick steps and retaining wall' },
  { id: 'work-25', w: 640, h: 480, alt: 'Blockwork extension shell with bi-fold openings under construction' },
  { id: 'work-01', w: 801, h: 602, alt: 'Finished room with bay window and oak-effect floor' },
  { id: 'work-27', w: 480, h: 640, alt: 'Rendered wall with tall arched window' },
  { id: 'work-04', w: 801, h: 602, alt: 'Finished room with wide opening to the garden' },
  { id: 'work-10', w: 602, h: 802, alt: 'Red steel beam bearing on blockwork' },
  { id: 'work-24', w: 640, h: 480, alt: 'Ground dug out for an extension behind a brick house' },
  { id: 'work-15', w: 801, h: 602, alt: 'Blockwork footings laid out for an extension' },
  { id: 'work-12', w: 801, h: 602, alt: 'Blockwork footings filled and levelled with sand' },
  { id: 'work-11', w: 602, h: 802, alt: 'Trench dug along a driveway' },
  { id: 'work-17', w: 602, h: 802, alt: 'Curved stone kerb edging a new driveway' },
];

// The five large (1920px) photographs.
export const feat = {
  joists: { id: 'feat-joists', w: 1920, h: 1300, alt: 'New floor joists and roof timbers over red steel beams' },
  roof: { id: 'feat-roof', w: 1920, h: 1300, alt: 'New slate roof with rooflight' },
  kitchenDetail: { id: 'feat-kitchen-detail', w: 1920, h: 1300, alt: 'Fitted kitchen cabinets with plinth lighting' },
  kitchen: { id: 'feat-kitchen', w: 1920, h: 1300, alt: 'Finished kitchen with exposed beams and window seat' },
  render: { id: 'feat-render', w: 1302, h: 1922, alt: 'Rendered extension with tall arched windows' },
};

export const roman = (n: number) => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][n] || String(n);
