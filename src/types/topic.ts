export type Subject = 'maths'|'biology';
export type Level = 'simple'|'intermediate'|'hard';
export type Question = {id:string; level:Level; kind:'maths'|'choice'; prompt:string; answer:string; options?:string[]; hint:string; solution:string[]; requiredForm?:'fraction'|'standard'|'percent'; generator?:'percentage-of'|'percentage-change'|'reverse-percent'|'venn-union'|'venn-intersection'|'venn-complement'|'decimal-fraction'|'hcf'|'lcm'|'surds'|'fractions'|'ratio'|'indices'|'bounds'|'algebra'|'generic-percent'};
export type Diagram = {type:'cell'|'diffusion'|'venn'|'plant'|'enzyme'|'transport'; labels:{id:string;name:string;description:string}[]};
export type Topic = {id:string;slug:string;subject:Subject;order:number;title:string;subtitle:string;intro:string;chunks:{heading:string;body:string;formula?:string;terms?:string[]}[];examples:{prompt:string;steps:string[]}[];questions:Question[];diagram?:Diagram;reviewPrerequisites?:string[]};
