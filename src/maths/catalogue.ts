/** Mathematics teaching sequence. Each section is one rule or skill, not a difficulty tab.
 * The exponent sequence follows Year 10 Mathematics Book 1, §1.2 and §1.3;
 * remaining sections follow the current Northstar objectives. */
export type MathsSection={id:string;title:string;rule:string;latex:string;notes:string;kind:string};
const s=(id:string,title:string,rule:string,latex:string,notes:string,kind:string):MathsSection=>({id,title,rule,latex,notes,kind});
export const mathsChapters:Record<string,MathsSection[]>={
 'indices-standard-form':[
 s('meaning','Recognise and evaluate powers','An index tells you how many factors of the base to multiply. The base is not multiplied by the index.',String.raw`a^n=\underbrace{a\times a\times\cdots\times a}_{n\text{ factors}}`,'First expand a short power, then evaluate. Compare powers such as 3⁴ and 4³: the base and index have different jobs.','index.value'),
 s('product','Law 1 · Multiply powers of the same base','Keep the base and add the indices. You may not add the indices when the bases differ.',String.raw`a^m\times a^n=a^{m+n}`,'Try writing out the factors to see why the rule works; then apply it to missing-index and compound expressions.','index.product'),
 s('quotient','Law 2 · Divide powers of the same base','Keep the base and subtract the index in the denominator from the index in the numerator.',String.raw`\dfrac{a^m}{a^n}=a^{m-n},\quad a\ne0`,'Cancel matching factors first. If the result has a negative index, rewrite it using a reciprocal.','index.quotient'),
 s('power','Law 3 · Raise a power to a power','Multiply the indices; do not add them. Brackets make a difference.',String.raw`(a^m)^n=a^{mn}`,'Do not confuse (a³)² with a³ × a². The first is a power of a power; the second is multiplication.','index.power'),
 s('zero','Law 4 · The zero index','Every non-zero number raised to zero is 1. It is not zero.',String.raw`a^0=1\quad (a\ne0)`,'Use the quotient law with equal indices to justify the rule. Then simplify mixed expressions containing zero powers.','index.zero'),
 s('negative','Negative indices','A negative index means reciprocal. It does not mean the value is negative.',String.raw`a^{-n}=\dfrac1{a^n}\quad(a\ne0)`,'Leave exact fractions rather than premature decimals. Combine the product and quotient laws where needed.','index.negative'),
 s('fractional','Fractional indices and roots','The denominator of the index gives the root; the numerator gives the power.',String.raw`a^{m/n}=\sqrt[n]{a^m}`,'For the problems here the bases are perfect positive powers, so answers are exact. Negative fractional powers need a reciprocal too.','index.fractional'),
 s('calculator','Evaluate powers using a calculator','Use the power key carefully, keeping negative and fractional indices inside their brackets.',String.raw`a^n+b^m
e(a+b)^{n+m}`,'Estimate first. Enter negative indices in brackets, and do not add unlike powers as though they shared an index.','index.calculator'),
 s('standard','Write numbers in standard form','The coefficient must be at least 1 and less than 10 in magnitude; the index records the decimal-place shift.',String.raw`N=a\times 10^n,\qquad 1\le |a|<10`,'Positive indices describe large magnitudes and negative indices describe small magnitudes. Always normalise the coefficient.','index.standard'),
 s('standard-ops','Calculate using standard form','Multiply coefficients and add indices; divide coefficients and subtract indices. Normalise at the end.',String.raw`(a\times10^m)(b\times10^n)=ab\times10^{m+n}`,'When adding quantities, rewrite them at a common power of ten first. Check whether the answer is physically sensible.','index.standardops')
 ],
 'decimals':[
 s('recurring','Convert recurring decimals to fractions','Multiply by the power of ten that shifts one full recurring block, then subtract the original.',String.raw`x=0.\overline{ab}\ \Longrightarrow\ 99x=ab`,'Make sure the repeating part cancels. One repeating digit uses 9; two use 99.','decimal.recurring'),
 s('significant','Round to significant figures','Begin counting at the first non-zero digit. The next digit decides whether to round up.',String.raw`\text{rounded value}=\text{nearest multiple of }10^k`,'Leading zeros are place holders; zeros inside a number can be significant. Watch what happens when rounding crosses 10.','decimal.sigfig'),
 s('places','Round to decimal places','Keep the stated number of digits after the decimal point. Look at the next digit to decide.',String.raw`\text{round}(x,d)=\dfrac{\text{round}(10^d x)}{10^d}`,'A result such as 7.00 shows two decimal places even though it has the same value as 7.','decimal.places'),
 s('estimate','Estimate and check calculations','Round each quantity to a sensible precision before calculating; an estimate checks the scale.',String.raw`a\times b\approx \widetilde a\times\widetilde b`,'A sensible estimate catches a misplaced decimal point. Give an approximate answer, not false precision.','decimal.estimate')
 ],
 'special-numbers':[
 s('prime','Write a number as prime factors','Divide repeatedly by primes, then group equal factors using indices.',String.raw`N=p_1^{a_1}p_2^{a_2}\cdots`,'A factor tree can look different, but the final prime factorisation is unique.','prime.factor'),
 s('hcf','Find the highest common factor','Choose only shared primes, taking each to the smaller index.',String.raw`\operatorname{HCF}(a,b)=\prod p^{\min(m_p,n_p)}`,'A greatest common factor divides both numbers exactly. It is useful when cutting into the largest equal groups.','prime.hcf'),
 s('lcm','Find the lowest common multiple','Include every prime required, taking each to the larger index.',String.raw`\operatorname{LCM}(a,b)=\prod p^{\max(m_p,n_p)}`,'The first simultaneous repeat occurs after one LCM, not after one HCF.','prime.lcm')
 ],
 'surds':[
 s('meaning','Recognise exact surds','Keep a square root in exact form when it cannot be simplified to a rational number.',String.raw`\sqrt{a^2b}=a\sqrt b`,'Do not replace √2 by 1.41 in an exact-answer question.','surd.meaning'),
 s('simplify','Simplify surds','Extract the largest square factor and collect like surds.',String.raw`\sqrt{a^2b}=a\sqrt b`,'Only like surds combine: 3√2 + 5√2 works, but √2 + √3 stays as it is.','surd.simplify'),
 s('rationalise','Rationalise a denominator','Multiply numerator and denominator by a suitable root, or by the conjugate of a binomial.',String.raw`\dfrac{1}{\sqrt a}=\dfrac{\sqrt a}{a}`,'Both numerator and denominator must be multiplied by the same expression.','surd.rational')
 ],
 'fractions':[
 s('order','Order and compare fractions','Rewrite the fractions using a common denominator or compare by cross-multiplication.',String.raw`\dfrac ab<\dfrac cd\iff ad<bc\quad(b,d>0)`,'Do not judge fractions by their denominators alone.','fraction.order'),
 s('quantity','Find a fraction of a quantity','Divide the amount by the denominator, then multiply by the numerator.',String.raw`\dfrac ab\text{ of }N=\dfrac{aN}{b}`,'In a word problem decide whether you need a fraction of the original or of the remainder.','fraction.quantity'),
 s('add','Add and subtract fractions','Make the denominators equal first, then combine the numerators.',String.raw`\dfrac ab+\dfrac cd=\dfrac{ad+bc}{bd}`,'Simplify the result only after checking the arithmetic.','fraction.add'),
 s('multiply','Multiply and divide fractions','Multiply across for products. To divide, multiply by the reciprocal.',String.raw`\dfrac ab\div\dfrac cd=\dfrac{ad}{bc}`,'Cross-cancellation can keep numbers manageable.','fraction.multiply'),
 s('mixed','Convert mixed and improper fractions','Multiply the whole part by the denominator and add the numerator.',String.raw`w\dfrac ab=\dfrac{wb+a}{b}`,'A mixed number such as 2 1/3 is a sum, not a multiplication.','fraction.mixed')
 ],
 'percentages':[
 s('of','Find a percentage of an amount','Write the percentage over 100 and multiply by the amount.',String.raw`p\%\text{ of }N=\dfrac{pN}{100}`,'One percent gives a useful check on your answer.','percent.of'),
 s('as','Express one amount as a percentage of another','Divide the part by the whole, then multiply by 100.',String.raw`\text{percent}=\dfrac{\text{part}}{\text{whole}}\times100\%`,'Check that you have chosen the correct whole.','percent.as'),
 s('change','Percentage increase and decrease','An increase uses a multiplier above 1; a decrease uses one below 1.',String.raw`\text{new}=\text{old}\left(1\pm\dfrac p{100}\right)`,'An increase of 20% followed by a decrease of 20% does not return to the start.','percent.change'),
 s('reverse','Reverse percentages','Divide the known final amount by the percentage multiplier.',String.raw`\text{old}=\dfrac{\text{new}}{1\pm p/100}`,'Never subtract the percentage from the final value to find the original.','percent.reverse'),
 s('repeated','Repeated percentage change','Apply a multiplier once for each change; order matters when rates vary.',String.raw`N=N_0(1+r_1)(1+r_2)\cdots`,'Write down each stage before calculating.','percent.repeated'),
 s('compound','Compound interest and depreciation','Repeated growth or decay is exponential, not simple interest.',String.raw`A=P\left(1\pm\dfrac r{100}\right)^t`,'Distinguish the final amount from the interest earned or value lost.','percent.compound')
 ],
 'ratio-proportion':[
 s('simplify','Simplify a ratio','Divide every part by the same positive common factor.',String.raw`ka:kb=a:b`,'Convert quantities to the same units before simplifying.','ratio.simplify'),
 s('share','Divide an amount in a ratio','Add the ratio parts, find one part, then scale up.',String.raw`\text{share}_A=\dfrac a{a+b}\,T`,'The larger share should match the larger ratio part.','ratio.share'),
 s('direct','Use direct proportion','If two quantities are directly proportional, their ratio is constant.',String.raw`y=kx`,'Double x and y must double too; distinguish direct proportion from adding a fixed amount.','ratio.direct'),
 s('units','Solve unit and rate problems','Convert units before comparing rates and use consistent time intervals.',String.raw`\text{rate}=\dfrac{\text{quantity}}{\text{time}}`,'A common error is mixing minutes and hours.','ratio.units')
 ],
 'degree-accuracy':[
 s('bounds','Find lower and upper bounds','Half a rounding unit lies on either side of the reported value.',String.raw`x-\dfrac u2\le X<x+\dfrac u2`,'The upper bound is a limit, not usually an included measurement.','bounds.interval'),
 s('calculations','Use bounds in calculations','Choose the extreme values that minimise or maximise the calculation.',String.raw`A_{\max}=L_{\max}\times W_{\max}`,'For positive dimensions, the maximum rectangle area uses both upper bounds.','bounds.area')
 ],
 'sets-venn':[
 s('notation','Read set notation and cardinality','Use n(A) for the number of members of A; ∩ means both, ∪ means either or both.',String.raw`n(A\cup B)=n(A)+n(B)-n(A\cap B)`,'Never count an element twice in a union.','sets.notation'),
 s('complements','Find complements and subsets','A complement includes everything in the universal set but not in A.',String.raw`n(A^{\prime})=n(U)-n(A)`,'State the universal set before taking a complement.','sets.complement'),
 s('venn','Solve two-set Venn diagrams','Fill the overlap first; then find the A-only and B-only regions.',String.raw`n(A\cup B)=n(A)+n(B)-n(A\cap B)`,'Leave the outside region until the union has been counted.','sets.venn'),
 s('probability','Calculate probability from a Venn diagram','Divide the number of favourable equally likely outcomes by the total.',String.raw`P(E)=\dfrac{n(E)}{n(U)}`,'Give an exact fraction when possible.','sets.probability')
 ],
 'algebra':[
 s('collect','Collect like terms','Add or subtract coefficients of identical variable terms.',String.raw`ax+bx=(a+b)x`,'x and x² are not like terms.','algebra.collect'),
 s('expand','Expand one bracket','Multiply every term in the bracket by the factor outside.',String.raw`a(bx+c)=abx+ac`,'A negative multiplier changes signs.','algebra.expand'),
 s('factor','Factor out a common factor','Find the highest common factor of the coefficients and shared variables.',String.raw`ab+ac=a(b+c)`,'Expand your answer to check it matches the original.','algebra.factor'),
 s('double','Expand two brackets','Multiply every term in the first bracket by every term in the second.',String.raw`(x+a)(x+b)=x^2+(a+b)x+ab`,'A diagram or four separate products prevents missing the middle terms.','algebra.foil'),
 s('quadratic','Factorise simple quadratics','Find two numbers whose sum is the x coefficient and whose product is the constant.',String.raw`x^2+(a+b)x+ab=(x+a)(x+b)`,'Check the factor pair by expanding.','algebra.quadratic')
 ]
};
