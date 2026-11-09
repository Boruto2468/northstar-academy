/** B5: hand-checked YouTube video watch pages, 2026-11-09. No embedded playback.
 * Lengths prefixed with ~ are approximate based on publicly available chapters, not exact metadata.
 * Run `npm run videos:check` to recheck YouTube oEmbed title/channel and availability.
 */
export type BiologyVideo={title:string;channel:string;length:string;url:string};
const video=(id:string,title:string,length:string):BiologyVideo=>({title,channel:'Cognito',length,url:`https://www.youtube.com/watch?v=${id}`});
export const biologyVideos:Record<string,{overview:BiologyVideo[];subtopics:Record<string,BiologyVideo[]>}>={
 'living-organisms':{
  overview:[video('aGDFNZApXXI','GCSE Biology - Characteristics of Living Things (Organisms)','6:23'),video('qRqa454ZIro','GCSE Biology - Classification Systems | Linnaean System','~6 min')],
  subtopics:{
   s1:[video('aGDFNZApXXI','GCSE Biology - Characteristics of Living Things (Organisms)','6:23')],
   s2:[video('qRqa454ZIro','GCSE Biology - Classification Systems | Linnaean System','~6 min')],
   s3:[], // Vertebrate/invertebrate-specific URL not verified; do not substitute general classification.
   s4:[]  // Biodiversity/sampling-specific URL not verified.
  }
 },
 'cell-structure':{
  overview:[video('bLeDekGNI_c','KS3 Biology - Animal & Plant Cells','~5 min'),video('MB6mE6weCS4','GCSE Biology - Levels of Organisation - Cells, Tissues, Organs and Organ Systems','4:25')],
  subtopics:{
   s1:[video('bLeDekGNI_c','KS3 Biology - Animal & Plant Cells','~5 min')],
   s2:[video('LNLz7mswPkQ','GCSE Biology - Differentiation and Specialised Cells','4:48')],
   s3:[video('MB6mE6weCS4','GCSE Biology - Levels of Organisation - Cells, Tissues, Organs and Organ Systems','4:25')],
   s4:[] // Magnification/microscopy URL not verified.
  }
 },
 'cell-movement':{
  overview:[video('vCJVXYmXkzM','GCSE Biology - Osmosis','~4 min'),video('tM0bGaaQ2jY','GCSE Biology - Active Transport','4:48')],
  subtopics:{
   s1:[], // Diffusion-only link verification could not be completed.
   s2:[video('vCJVXYmXkzM','GCSE Biology - Osmosis','~4 min')],
   s3:[video('tM0bGaaQ2jY','GCSE Biology - Active Transport','4:48')],
   s4:[] // Exchange-rate factors-specific link not verified.
  }
 },
 'molecules-enzymes':{
  overview:[video('YDDjkxz2_1k','GCSE Biology - Nutrition - Carbohydrates | Lipids | Proteins | Vitamins | Minerals','~6 min'),video('gUncqL1ul8Q','GCSE Biology - What are Enzymes?','4:55')],
  subtopics:{
   s1:[video('YDDjkxz2_1k','GCSE Biology - Nutrition - Carbohydrates | Lipids | Proteins | Vitamins | Minerals','~6 min')],
   s2:[video('gUncqL1ul8Q','GCSE Biology - What are Enzymes?','4:55')],
   s3:[], // Specific effects of pH and temperature not clearly covered in verified video.
   s4:[video('2fPwfvbBRT0','GCSE Biology - Food Tests Practicals','~5 min')]
  }
 },
 'plant-nutrition':{
  overview:[video('cucQtak-jco','GCSE Biology - Photosynthesis','~4 min'),video('c9aUWHleZ_k','GCSE Biology - Structure of a Leaf | Plant Cell Organisation','~5 min')],
  subtopics:{
   s1:[video('cucQtak-jco','GCSE Biology - Photosynthesis','~4 min')],
   s2:[video('c9aUWHleZ_k','GCSE Biology - Structure of a Leaf | Plant Cell Organisation','~5 min')],
   s3:[video('6sLrh-SDv_Y','GCSE Biology - Factors Affecting the Rate of Photosynthesis | Limiting Factor Graphs','~5 min')]
  }
 },
 'plant-transport':{
  overview:[video('s06FvGH3QJo','GCSE Biology - Transpiration & Translocation','~4 min'),video('c9aUWHleZ_k','GCSE Biology - Structure of a Leaf | Plant Cell Organisation','~5 min')],
  subtopics:{
   s1:[video('s06FvGH3QJo','GCSE Biology - Transpiration & Translocation','~4 min')],
   s2:[video('s06FvGH3QJo','GCSE Biology - Transpiration & Translocation','~4 min')],
   s3:[video('s06FvGH3QJo','GCSE Biology - Transpiration & Translocation','~4 min')]
  }
 }
};
export function videosFor(topicId:string,subtopicId?:string):BiologyVideo[]{
 const item=biologyVideos[topicId];return item?(subtopicId?(item.subtopics[subtopicId]??[]):item.overview):[];
}
