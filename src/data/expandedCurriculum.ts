import type {Subtopic} from "@/types/topic";
/** Teacher-authored, per-skill curriculum expansion. */
export const expandedCurriculum: Record<string, Subtopic[]> = {
  "decimals": [
    {
      "id": "s1",
      "title": "Recurring decimals",
      "learningGoals": [
        "Explain and apply recurring decimals",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "A recurring decimal repeats a digit or block forever. Let x be the number, shift the repeating digits with a power of ten, then subtract to remove the repeating part."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Convert 0.̅3 to a fraction.",
          "steps": [
            "Let x = 0.333…",
            "10x = 3.333…",
            "9x = 3, so x = 1/3."
          ]
        }
      ],
      "questions": [
        {
          "id": "decimals-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Convert 0.333… to a fraction.",
          "answer": "1/3",
          "options": [],
          "hint": "Use 10x − x.",
          "solution": [
            "Let x = 0.333…",
            "10x = 3.333…",
            "9x = 3, so x = 1/3."
          ]
        },
        {
          "id": "decimals-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Convert 0.181818… to a fraction.",
          "answer": "2/11",
          "options": [],
          "hint": "Use 100x−x.",
          "solution": [
            "99x=18, x=18/99=2/11."
          ]
        },
        {
          "id": "decimals-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "Convert 0.1666… to a fraction.",
          "answer": "1/6",
          "options": [],
          "hint": "Subtract x from 10x then solve.",
          "solution": [
            "10x−x=1.5, so x=1/6."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Significant figures",
      "learningGoals": [
        "Explain and apply significant figures",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Start counting at the first non-zero digit. Zeros between non-zero digits count; leading zeros do not. Round using the next digit."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Round 0.004786 to 2 significant figures.",
          "steps": [
            "First significant digit is 4.",
            "The third significant digit is 8, so round 7 up.",
            "Answer: 0.0048."
          ]
        }
      ],
      "questions": [
        {
          "id": "decimals-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Round 0.006742 to 2 significant figures.",
          "answer": "0.0067",
          "options": [],
          "hint": "Count from the first non-zero digit.",
          "solution": [
            "First significant digit is 4.",
            "The third significant digit is 8, so round 7 up.",
            "Answer: 0.0048."
          ]
        },
        {
          "id": "decimals-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Round 0.00087654 to 3 significant figures.",
          "answer": "0.000877",
          "options": [],
          "hint": "Start at 8.",
          "solution": [
            "8,7,6 then next 5 rounds 6 to 7."
          ]
        },
        {
          "id": "decimals-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "Round 9995 to 3 significant figures.",
          "answer": "10000",
          "options": [],
          "hint": "Rounding can change place value.",
          "solution": [
            "9995 → 10000 to 3 s.f."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Decimal places",
      "learningGoals": [
        "Explain and apply decimal places",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Decimal places count digits after the decimal point, including zeros. Check the next digit to round."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Round 17.368 to 2 decimal places.",
          "steps": [
            "Keep 3 and 6 after the decimal.",
            "The next digit is 8: round 6 up.",
            "Answer 17.37."
          ]
        }
      ],
      "questions": [
        {
          "id": "decimals-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "Round 3.146 to 2 decimal places.",
          "answer": "3.15",
          "options": [],
          "hint": "Look at the third decimal digit.",
          "solution": [
            "Keep 3 and 6 after the decimal.",
            "The next digit is 8: round 6 up.",
            "Answer 17.37."
          ]
        },
        {
          "id": "decimals-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Round 6.995 to 2 decimal places.",
          "answer": "7.00",
          "options": [],
          "hint": "Keep two places after carrying.",
          "solution": [
            "6.995 rounds to 7.00."
          ]
        },
        {
          "id": "decimals-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "Round 0.09996 to 3 decimal places.",
          "answer": "0.100",
          "options": [],
          "hint": "Third decimal is 9; next 9 rounds up.",
          "solution": [
            "0.09996 → 0.100."
          ]
        }
      ]
    },
    {
      "id": "s4",
      "title": "Estimation and calculator checks",
      "learningGoals": [
        "Explain and apply estimation and calculator checks",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Estimate before calculating by rounding numbers to one significant figure. Compare the estimate with the calculator result to catch errors."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Estimate 48.7 × 19.8.",
          "steps": [
            "48.7 ≈ 50 and 19.8 ≈ 20.",
            "50 × 20 = 1000.",
            "The exact answer should be near 1000."
          ]
        }
      ],
      "questions": [
        {
          "id": "decimals-s4-simple",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "simple",
          "prompt": "Estimate 61 × 39 by rounding to 1 significant figure.",
          "answer": "2400",
          "options": [],
          "hint": "60 × 40.",
          "solution": [
            "48.7 ≈ 50 and 19.8 ≈ 20.",
            "50 × 20 = 1000.",
            "The exact answer should be near 1000."
          ]
        },
        {
          "id": "decimals-s4-intermediate",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Estimate 0.049 × 2100 to 1 significant figure in each factor.",
          "answer": "100",
          "options": [],
          "hint": "Round to 0.05 and 2000.",
          "solution": [
            "0.05 × 2000=100."
          ]
        },
        {
          "id": "decimals-s4-hard",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "hard",
          "prompt": "Estimate (498 × 19.6)/0.51 to 1 significant figure.",
          "answer": "20000",
          "options": [],
          "hint": "Round 500×20÷0.5.",
          "solution": [
            "500×20÷0.5=20000."
          ]
        }
      ]
    }
  ],
  "special-numbers": [
    {
      "id": "s1",
      "title": "Prime factor form",
      "learningGoals": [
        "Explain and apply prime factor form",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "A prime has exactly two positive factors. A factor tree breaks a composite number into primes. Write repeated factors as powers."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Factorise 180.",
          "steps": [
            "180 = 18 × 10.",
            "18 = 2 × 3² and 10 = 2 × 5.",
            "180 = 2² × 3² × 5."
          ]
        }
      ],
      "questions": [
        {
          "id": "special-numbers-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Write 72 as a product of prime factors.",
          "answer": "2^3*3^2",
          "options": [],
          "hint": "Build a factor tree.",
          "solution": [
            "180 = 18 × 10.",
            "18 = 2 × 3² and 10 = 2 × 5.",
            "180 = 2² × 3² × 5."
          ]
        },
        {
          "id": "special-numbers-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Write 72 as a product of prime factors.",
          "answer": "2^3*3^2",
          "options": [],
          "hint": "Build a factor tree.",
          "solution": [
            "180 = 18 × 10.",
            "18 = 2 × 3² and 10 = 2 × 5.",
            "180 = 2² × 3² × 5."
          ]
        },
        {
          "id": "special-numbers-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "Write 72 as a product of prime factors.",
          "answer": "2^3*3^2",
          "options": [],
          "hint": "Build a factor tree.",
          "solution": [
            "180 = 18 × 10.",
            "18 = 2 × 3² and 10 = 2 × 5.",
            "180 = 2² × 3² × 5."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Highest common factor",
      "learningGoals": [
        "Explain and apply highest common factor",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "The HCF is the largest integer dividing every given number. Use the lowest power of each shared prime factor."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Find HCF(72, 120).",
          "steps": [
            "72 = 2³ × 3²; 120 = 2³ × 3 × 5.",
            "Common factors: 2³ × 3.",
            "HCF = 24."
          ]
        }
      ],
      "questions": [
        {
          "id": "special-numbers-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Find HCF(48, 60).",
          "answer": "12",
          "options": [],
          "hint": "Use shared prime factors.",
          "solution": [
            "72 = 2³ × 3²; 120 = 2³ × 3 × 5.",
            "Common factors: 2³ × 3.",
            "HCF = 24."
          ]
        },
        {
          "id": "special-numbers-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Find HCF(48, 60).",
          "answer": "12",
          "options": [],
          "hint": "Use shared prime factors.",
          "solution": [
            "72 = 2³ × 3²; 120 = 2³ × 3 × 5.",
            "Common factors: 2³ × 3.",
            "HCF = 24."
          ]
        },
        {
          "id": "special-numbers-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "Find HCF(48, 60).",
          "answer": "12",
          "options": [],
          "hint": "Use shared prime factors.",
          "solution": [
            "72 = 2³ × 3²; 120 = 2³ × 3 × 5.",
            "Common factors: 2³ × 3.",
            "HCF = 24."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Lowest common multiple",
      "learningGoals": [
        "Explain and apply lowest common multiple",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "The LCM is the smallest positive multiple shared by all numbers. Use the highest required power of every prime factor."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Find LCM(12, 18).",
          "steps": [
            "12 = 2² × 3; 18 = 2 × 3².",
            "LCM = 2² × 3².",
            "Answer 36."
          ]
        }
      ],
      "questions": [
        {
          "id": "special-numbers-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "Find LCM(8, 12).",
          "answer": "24",
          "options": [],
          "hint": "Use the largest power of each prime.",
          "solution": [
            "12 = 2² × 3; 18 = 2 × 3².",
            "LCM = 2² × 3².",
            "Answer 36."
          ]
        },
        {
          "id": "special-numbers-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Find LCM(8, 12).",
          "answer": "24",
          "options": [],
          "hint": "Use the largest power of each prime.",
          "solution": [
            "12 = 2² × 3; 18 = 2 × 3².",
            "LCM = 2² × 3².",
            "Answer 36."
          ]
        },
        {
          "id": "special-numbers-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "Find LCM(8, 12).",
          "answer": "24",
          "options": [],
          "hint": "Use the largest power of each prime.",
          "solution": [
            "12 = 2² × 3; 18 = 2 × 3².",
            "LCM = 2² × 3².",
            "Answer 36."
          ]
        }
      ]
    }
  ],
  "surds": [
    {
      "id": "s1",
      "title": "Meaning of surds",
      "learningGoals": [
        "Explain and apply meaning of surds",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "A surd is an irrational root kept in exact form. √2 is not 1.41 exactly. Avoid rounding until the final answer."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Explain why √2 is a surd.",
          "steps": [
            "2 is not a perfect square.",
            "Its square root cannot be written as a ratio of integers.",
            "Keep the exact symbol √2."
          ]
        }
      ],
      "questions": [
        {
          "id": "surds-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Evaluate √49.",
          "answer": "7",
          "options": [],
          "hint": "Perfect squares have integer square roots.",
          "solution": [
            "2 is not a perfect square.",
            "Its square root cannot be written as a ratio of integers.",
            "Keep the exact symbol √2."
          ]
        },
        {
          "id": "surds-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Evaluate √49.",
          "answer": "7",
          "options": [],
          "hint": "Perfect squares have integer square roots.",
          "solution": [
            "2 is not a perfect square.",
            "Its square root cannot be written as a ratio of integers.",
            "Keep the exact symbol √2."
          ]
        },
        {
          "id": "surds-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "Evaluate √49.",
          "answer": "7",
          "options": [],
          "hint": "Perfect squares have integer square roots.",
          "solution": [
            "2 is not a perfect square.",
            "Its square root cannot be written as a ratio of integers.",
            "Keep the exact symbol √2."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Simplifying surds",
      "learningGoals": [
        "Explain and apply simplifying surds",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Use √(ab)=√a√b for non-negative a and b. Extract the largest perfect-square factor."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Simplify √98.",
          "steps": [
            "98 = 49 × 2.",
            "√98 = √49 × √2.",
            "Answer 7√2."
          ]
        }
      ],
      "questions": [
        {
          "id": "surds-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Simplify √72.",
          "answer": "6*sqrt(2)",
          "options": [],
          "hint": "Look for a square factor.",
          "solution": [
            "98 = 49 × 2.",
            "√98 = √49 × √2.",
            "Answer 7√2."
          ]
        },
        {
          "id": "surds-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Simplify √72.",
          "answer": "6*sqrt(2)",
          "options": [],
          "hint": "Look for a square factor.",
          "solution": [
            "98 = 49 × 2.",
            "√98 = √49 × √2.",
            "Answer 7√2."
          ]
        },
        {
          "id": "surds-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "Simplify √72.",
          "answer": "6*sqrt(2)",
          "options": [],
          "hint": "Look for a square factor.",
          "solution": [
            "98 = 49 × 2.",
            "√98 = √49 × √2.",
            "Answer 7√2."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Rationalising denominators",
      "learningGoals": [
        "Explain and apply rationalising denominators",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Multiply top and bottom by a root or conjugate to remove a surd from the denominator."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Rationalise 5/√3.",
          "steps": [
            "Multiply numerator and denominator by √3.",
            "5√3/(√3 × √3).",
            "Answer 5√3/3."
          ]
        }
      ],
      "questions": [
        {
          "id": "surds-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "Rationalise 1/√2.",
          "answer": "sqrt(2)/2",
          "options": [],
          "hint": "Multiply by √2/√2.",
          "solution": [
            "Multiply numerator and denominator by √3.",
            "5√3/(√3 × √3).",
            "Answer 5√3/3."
          ]
        },
        {
          "id": "surds-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Rationalise 1/√2.",
          "answer": "sqrt(2)/2",
          "options": [],
          "hint": "Multiply by √2/√2.",
          "solution": [
            "Multiply numerator and denominator by √3.",
            "5√3/(√3 × √3).",
            "Answer 5√3/3."
          ]
        },
        {
          "id": "surds-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "Rationalise 1/√2.",
          "answer": "sqrt(2)/2",
          "options": [],
          "hint": "Multiply by √2/√2.",
          "solution": [
            "Multiply numerator and denominator by √3.",
            "5√3/(√3 × √3).",
            "Answer 5√3/3."
          ]
        }
      ]
    }
  ],
  "fractions": [
    {
      "id": "s1",
      "title": "Equivalent fractions and ordering",
      "learningGoals": [
        "Explain and apply equivalent fractions and ordering",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Use a common denominator or compare cross-products. Negative fractions need careful ordering."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Order 2/3 and 3/5.",
          "steps": [
            "Cross-products: 2 × 5 = 10; 3 × 3 = 9.",
            "10 > 9.",
            "Therefore 2/3 > 3/5."
          ]
        }
      ],
      "questions": [
        {
          "id": "fractions-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Which is larger: 3/4 or 2/3? Answer 1 for 3/4, 2 for 2/3.",
          "answer": "1",
          "options": [],
          "hint": "Compare cross-products.",
          "solution": [
            "Cross-products: 2 × 5 = 10; 3 × 3 = 9.",
            "10 > 9.",
            "Therefore 2/3 > 3/5."
          ]
        },
        {
          "id": "fractions-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Which is larger: 3/4 or 2/3? Answer 1 for 3/4, 2 for 2/3.",
          "answer": "1",
          "options": [],
          "hint": "Compare cross-products.",
          "solution": [
            "Cross-products: 2 × 5 = 10; 3 × 3 = 9.",
            "10 > 9.",
            "Therefore 2/3 > 3/5."
          ]
        },
        {
          "id": "fractions-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "Which is larger: 3/4 or 2/3? Answer 1 for 3/4, 2 for 2/3.",
          "answer": "1",
          "options": [],
          "hint": "Compare cross-products.",
          "solution": [
            "Cross-products: 2 × 5 = 10; 3 × 3 = 9.",
            "10 > 9.",
            "Therefore 2/3 > 3/5."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Fraction of a quantity",
      "learningGoals": [
        "Explain and apply fraction of a quantity",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Divide by the denominator to find one equal part, then multiply by the numerator."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Find 5/8 of 64.",
          "steps": [
            "64 ÷ 8 = 8.",
            "8 × 5 = 40.",
            "Answer 40."
          ]
        }
      ],
      "questions": [
        {
          "id": "fractions-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Find 3/5 of 60.",
          "answer": "36",
          "options": [],
          "hint": "Divide by five then multiply by three.",
          "solution": [
            "64 ÷ 8 = 8.",
            "8 × 5 = 40.",
            "Answer 40."
          ]
        },
        {
          "id": "fractions-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Find 3/5 of 60.",
          "answer": "36",
          "options": [],
          "hint": "Divide by five then multiply by three.",
          "solution": [
            "64 ÷ 8 = 8.",
            "8 × 5 = 40.",
            "Answer 40."
          ]
        },
        {
          "id": "fractions-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "Find 3/5 of 60.",
          "answer": "36",
          "options": [],
          "hint": "Divide by five then multiply by three.",
          "solution": [
            "64 ÷ 8 = 8.",
            "8 × 5 = 40.",
            "Answer 40."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Adding and subtracting",
      "learningGoals": [
        "Explain and apply adding and subtracting",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Find a common denominator before adding or subtracting numerators. Simplify the result."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Find 2/3 + 1/4.",
          "steps": [
            "Common denominator is 12.",
            "8/12 + 3/12 = 11/12.",
            "Answer 11/12."
          ]
        }
      ],
      "questions": [
        {
          "id": "fractions-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "Calculate 1/2 + 1/3.",
          "answer": "5/6",
          "options": [],
          "hint": "Use sixths.",
          "solution": [
            "Common denominator is 12.",
            "8/12 + 3/12 = 11/12.",
            "Answer 11/12."
          ]
        },
        {
          "id": "fractions-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Calculate 1/2 + 1/3.",
          "answer": "5/6",
          "options": [],
          "hint": "Use sixths.",
          "solution": [
            "Common denominator is 12.",
            "8/12 + 3/12 = 11/12.",
            "Answer 11/12."
          ]
        },
        {
          "id": "fractions-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "Calculate 1/2 + 1/3.",
          "answer": "5/6",
          "options": [],
          "hint": "Use sixths.",
          "solution": [
            "Common denominator is 12.",
            "8/12 + 3/12 = 11/12.",
            "Answer 11/12."
          ]
        }
      ]
    },
    {
      "id": "s4",
      "title": "Multiplication and division",
      "learningGoals": [
        "Explain and apply multiplication and division",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Multiply numerators and denominators. For division, multiply by the reciprocal of the second fraction."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Calculate 3/4 ÷ 2/5.",
          "steps": [
            "Invert 2/5 to 5/2.",
            "3/4 × 5/2 = 15/8.",
            "Answer 1 7/8."
          ]
        }
      ],
      "questions": [
        {
          "id": "fractions-s4-simple",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "simple",
          "prompt": "Calculate 2/3 × 3/5.",
          "answer": "2/5",
          "options": [],
          "hint": "Cancel the common factor.",
          "solution": [
            "Invert 2/5 to 5/2.",
            "3/4 × 5/2 = 15/8.",
            "Answer 1 7/8."
          ]
        },
        {
          "id": "fractions-s4-intermediate",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Calculate 2/3 × 3/5.",
          "answer": "2/5",
          "options": [],
          "hint": "Cancel the common factor.",
          "solution": [
            "Invert 2/5 to 5/2.",
            "3/4 × 5/2 = 15/8.",
            "Answer 1 7/8."
          ]
        },
        {
          "id": "fractions-s4-hard",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "hard",
          "prompt": "Calculate 2/3 × 3/5.",
          "answer": "2/5",
          "options": [],
          "hint": "Cancel the common factor.",
          "solution": [
            "Invert 2/5 to 5/2.",
            "3/4 × 5/2 = 15/8.",
            "Answer 1 7/8."
          ]
        }
      ]
    },
    {
      "id": "s5",
      "title": "Mixed and improper fractions",
      "learningGoals": [
        "Explain and apply mixed and improper fractions",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Convert a mixed number to an improper fraction before multiplication or division. Convert back if required."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Convert 2 3/5 to improper form.",
          "steps": [
            "2 × 5 + 3 = 13.",
            "Keep denominator 5.",
            "Answer 13/5."
          ]
        }
      ],
      "questions": [
        {
          "id": "fractions-s5-simple",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "simple",
          "prompt": "Convert 1 3/4 to an improper fraction.",
          "answer": "7/4",
          "options": [],
          "hint": "Whole × denominator + numerator.",
          "solution": [
            "2 × 5 + 3 = 13.",
            "Keep denominator 5.",
            "Answer 13/5."
          ]
        },
        {
          "id": "fractions-s5-intermediate",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Convert 1 3/4 to an improper fraction.",
          "answer": "7/4",
          "options": [],
          "hint": "Whole × denominator + numerator.",
          "solution": [
            "2 × 5 + 3 = 13.",
            "Keep denominator 5.",
            "Answer 13/5."
          ]
        },
        {
          "id": "fractions-s5-hard",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "hard",
          "prompt": "Convert 1 3/4 to an improper fraction.",
          "answer": "7/4",
          "options": [],
          "hint": "Whole × denominator + numerator.",
          "solution": [
            "2 × 5 + 3 = 13.",
            "Keep denominator 5.",
            "Answer 13/5."
          ]
        }
      ]
    }
  ],
  "percentages": [
    {
      "id": "s1",
      "title": "Percentage of a quantity",
      "learningGoals": [
        "Explain and apply percentage of a quantity",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Percent means per hundred. Convert to a fraction or decimal multiplier, then multiply."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Find 17.5% of £240.",
          "steps": [
            "17.5% = 0.175.",
            "0.175 × 240 = 42.",
            "Answer £42."
          ]
        }
      ],
      "questions": [
        {
          "id": "percentages-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Find 12% of 250.",
          "answer": "30",
          "options": [],
          "hint": "12% is 0.12.",
          "solution": [
            "17.5% = 0.175.",
            "0.175 × 240 = 42.",
            "Answer £42."
          ]
        },
        {
          "id": "percentages-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "A £160 item is discounted 12.5%, then increased by 10%. Final price?",
          "answer": "154",
          "options": [],
          "hint": "Multiply both change factors.",
          "solution": [
            "160 × 0.875 × 1.1 = 154."
          ]
        },
        {
          "id": "percentages-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "A price is discounted by 20%, then increased by 25%. Original £480. Final price?",
          "answer": "480",
          "options": [],
          "hint": "Apply both multipliers in order.",
          "solution": [
            "480 × 0.8 × 1.25 = 480."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Expressing as a percentage",
      "learningGoals": [
        "Explain and apply expressing as a percentage",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Divide the part by the whole and multiply by 100. The whole must be the correct reference amount."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "18 out of 45 as a percentage.",
          "steps": [
            "18 ÷ 45 = 0.4.",
            "0.4 × 100 = 40.",
            "Answer 40%."
          ]
        }
      ],
      "questions": [
        {
          "id": "percentages-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Express 15 out of 60 as a percentage.",
          "answer": "25%",
          "options": [],
          "hint": "Part divided by whole.",
          "solution": [
            "18 ÷ 45 = 0.4.",
            "0.4 × 100 = 40.",
            "Answer 40%."
          ]
        },
        {
          "id": "percentages-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "27 of 90 pupils choose Biology. Give the percentage.",
          "answer": "30%",
          "options": [],
          "hint": "Part ÷ whole × 100.",
          "solution": [
            "27 ÷ 90 × 100 = 30%."
          ]
        },
        {
          "id": "percentages-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "A class grows from 32 to 44. Find percentage increase.",
          "answer": "37.5%",
          "options": [],
          "hint": "Compare the increase to the ORIGINAL size.",
          "solution": [
            "12 ÷ 32 × 100 = 37.5%."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Percentage increase and decrease",
      "learningGoals": [
        "Explain and apply percentage increase and decrease",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Use multiplier 1+p/100 for an increase or 1−p/100 for a decrease."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Reduce £360 by 15%.",
          "steps": [
            "Multiplier = 0.85.",
            "360 × 0.85 = 306.",
            "Answer £306."
          ]
        }
      ],
      "questions": [
        {
          "id": "percentages-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "Decrease 200 by 15%.",
          "answer": "170",
          "options": [],
          "hint": "Multiply by 0.85.",
          "solution": [
            "Multiplier = 0.85.",
            "360 × 0.85 = 306.",
            "Answer £306."
          ]
        },
        {
          "id": "percentages-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "A £240 laptop is reduced 15% then a 5% fee is applied. Final price?",
          "answer": "214.2",
          "options": [],
          "hint": "Multiply by 0.85 and 1.05.",
          "solution": [
            "240 × 0.85 × 1.05 = 214.2."
          ]
        },
        {
          "id": "percentages-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "A £400 item rises 25% then falls 20%. Final price?",
          "answer": "400",
          "options": [],
          "hint": "Percentages do not add: multiply.",
          "solution": [
            "400 × 1.25 × 0.8 = 400."
          ]
        }
      ]
    },
    {
      "id": "s4",
      "title": "Reverse percentages",
      "learningGoals": [
        "Explain and apply reverse percentages",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "The final amount is a percentage of the original. Divide by the multiplier, not by the percentage."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "A price after 20% VAT is £144.",
          "steps": [
            "Final multiplier = 1.2.",
            "Original = 144 ÷ 1.2.",
            "Answer £120."
          ]
        }
      ],
      "questions": [
        {
          "id": "percentages-s4-simple",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "simple",
          "prompt": "After a 25% increase, a price is £100. Find the original.",
          "answer": "80",
          "options": [],
          "hint": "Divide by 1.25.",
          "solution": [
            "Final multiplier = 1.2.",
            "Original = 144 ÷ 1.2.",
            "Answer £120."
          ]
        },
        {
          "id": "percentages-s4-intermediate",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "A price after a 12% reduction is £264. Original price?",
          "answer": "300",
          "options": [],
          "hint": "Final is 88% of original.",
          "solution": [
            "264 ÷ 0.88 = 300."
          ]
        },
        {
          "id": "percentages-s4-hard",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "hard",
          "prompt": "After 20% VAT and a 10% discount, the final price is £216. Original before VAT?",
          "answer": "200",
          "options": [],
          "hint": "Divide by both multipliers.",
          "solution": [
            "216 ÷ (1.2 × 0.9) = 200."
          ]
        }
      ]
    },
    {
      "id": "s5",
      "title": "Repeated percentage change",
      "learningGoals": [
        "Explain and apply repeated percentage change",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Successive changes multiply. A rise of 10% followed by a fall of 10% does not cancel out."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "£500 grows by 8% for 3 years.",
          "steps": [
            "Multiplier = 1.08.",
            "500 × 1.08³ = 629.856.",
            "To the nearest penny £629.86."
          ]
        }
      ],
      "questions": [
        {
          "id": "percentages-s5-simple",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "simple",
          "prompt": "£200 grows by 10% for two years. Find its value.",
          "answer": "242",
          "options": [],
          "hint": "Multiply by 1.1 twice.",
          "solution": [
            "Multiplier = 1.08.",
            "500 × 1.08³ = 629.856.",
            "To the nearest penny £629.86."
          ]
        },
        {
          "id": "percentages-s5-intermediate",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "A £500 balance grows by 4% for three years. Value to nearest penny?",
          "answer": "562.43",
          "options": [],
          "hint": "Use a power of 3.",
          "solution": [
            "500 × 1.04³ = 562.432 → £562.43."
          ]
        },
        {
          "id": "percentages-s5-hard",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "hard",
          "prompt": "A quantity rises 25% then falls by p% to return to its start. Find p.",
          "answer": "20",
          "options": [],
          "hint": "Solve 1.25(1−p/100)=1.",
          "solution": [
            "1/1.25=0.8, so p=20%."
          ]
        }
      ]
    },
    {
      "id": "s6",
      "title": "Compound interest and depreciation",
      "learningGoals": [
        "Explain and apply compound interest and depreciation",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "For constant annual growth or decay, A=P(1±r/100)^n. Interest compounds on the updated balance."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "A £1200 device depreciates by 15% annually for two years.",
          "steps": [
            "Multiplier = 0.85.",
            "1200 × 0.85² = 867.",
            "Value £867."
          ]
        }
      ],
      "questions": [
        {
          "id": "percentages-s6-simple",
          "subtopicId": "s6",
          "kind": "maths",
          "level": "simple",
          "prompt": "£1000 grows by 5% for 2 years.",
          "answer": "1102.5",
          "options": [],
          "hint": "Use 1000 × 1.05².",
          "solution": [
            "Multiplier = 0.85.",
            "1200 × 0.85² = 867.",
            "Value £867."
          ]
        },
        {
          "id": "percentages-s6-intermediate",
          "subtopicId": "s6",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "A £2000 machine loses 10% of its value yearly for three years. Value?",
          "answer": "1458",
          "options": [],
          "hint": "Use 0.9 cubed.",
          "solution": [
            "2000 × 0.9³ = 1458."
          ]
        },
        {
          "id": "percentages-s6-hard",
          "subtopicId": "s6",
          "kind": "maths",
          "level": "hard",
          "prompt": "£1000 becomes £1210 after two years of equal compound growth. Annual rate (%)?",
          "answer": "10",
          "options": [],
          "hint": "Find square root of 1.21.",
          "solution": [
            "(1+r/100)²=1.21; r=10%."
          ]
        }
      ]
    }
  ],
  "ratio-proportion": [
    {
      "id": "s1",
      "title": "Simplifying ratios",
      "learningGoals": [
        "Explain and apply simplifying ratios",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Divide every term by the same common factor. Convert quantities to matching units first."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Simplify 45:60.",
          "steps": [
            "HCF = 15.",
            "45÷15 : 60÷15.",
            "Answer 3:4."
          ]
        }
      ],
      "questions": [
        {
          "id": "ratio-proportion-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Simplify 18:24.",
          "answer": "3/4",
          "options": [],
          "hint": "Divide both by 6; enter first term / second term.",
          "solution": [
            "HCF = 15.",
            "45÷15 : 60÷15.",
            "Answer 3:4."
          ]
        },
        {
          "id": "ratio-proportion-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Simplify 18:24.",
          "answer": "3/4",
          "options": [],
          "hint": "Divide both by 6; enter first term / second term.",
          "solution": [
            "HCF = 15.",
            "45÷15 : 60÷15.",
            "Answer 3:4."
          ]
        },
        {
          "id": "ratio-proportion-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "Simplify 18:24.",
          "answer": "3/4",
          "options": [],
          "hint": "Divide both by 6; enter first term / second term.",
          "solution": [
            "HCF = 15.",
            "45÷15 : 60÷15.",
            "Answer 3:4."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Dividing in a ratio",
      "learningGoals": [
        "Explain and apply dividing in a ratio",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Add the parts, divide the total into equal parts, then multiply by each ratio number."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Share £420 in the ratio 2:5.",
          "steps": [
            "Total 7 parts.",
            "Each part £60.",
            "Shares £120 and £300."
          ]
        }
      ],
      "questions": [
        {
          "id": "ratio-proportion-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Share 80 in the ratio 3:5. Find the larger share.",
          "answer": "50",
          "options": [],
          "hint": "8 parts; larger gets five.",
          "solution": [
            "Total 7 parts.",
            "Each part £60.",
            "Shares £120 and £300."
          ]
        },
        {
          "id": "ratio-proportion-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Share 80 in the ratio 3:5. Find the larger share.",
          "answer": "50",
          "options": [],
          "hint": "8 parts; larger gets five.",
          "solution": [
            "Total 7 parts.",
            "Each part £60.",
            "Shares £120 and £300."
          ]
        },
        {
          "id": "ratio-proportion-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "Share 80 in the ratio 3:5. Find the larger share.",
          "answer": "50",
          "options": [],
          "hint": "8 parts; larger gets five.",
          "solution": [
            "Total 7 parts.",
            "Each part £60.",
            "Shares £120 and £300."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Direct proportion",
      "learningGoals": [
        "Explain and apply direct proportion",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "If y is directly proportional to x, y=kx. For a square or cube relationship, state that explicitly."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "y∝x, y=18 when x=6. Find y when x=11.",
          "steps": [
            "k = 18/6 = 3.",
            "y=3x.",
            "y=33."
          ]
        }
      ],
      "questions": [
        {
          "id": "ratio-proportion-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "y∝x, y=20 when x=5. Find y when x=8.",
          "answer": "32",
          "options": [],
          "hint": "Find k first.",
          "solution": [
            "k = 18/6 = 3.",
            "y=3x.",
            "y=33."
          ]
        },
        {
          "id": "ratio-proportion-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "y∝x, y=20 when x=5. Find y when x=8.",
          "answer": "32",
          "options": [],
          "hint": "Find k first.",
          "solution": [
            "k = 18/6 = 3.",
            "y=3x.",
            "y=33."
          ]
        },
        {
          "id": "ratio-proportion-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "y∝x, y=20 when x=5. Find y when x=8.",
          "answer": "32",
          "options": [],
          "hint": "Find k first.",
          "solution": [
            "k = 18/6 = 3.",
            "y=3x.",
            "y=33."
          ]
        }
      ]
    },
    {
      "id": "s4",
      "title": "Units, time and currency",
      "learningGoals": [
        "Explain and apply units, time and currency",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Convert to a common unit before operating. Use 60 seconds per minute, 60 minutes per hour and the given exchange rate."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Convert 2 h 35 min to minutes.",
          "steps": [
            "2 h = 120 min.",
            "120 + 35 = 155.",
            "Answer 155 min."
          ]
        }
      ],
      "questions": [
        {
          "id": "ratio-proportion-s4-simple",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "simple",
          "prompt": "Convert 3 hours 20 minutes to minutes.",
          "answer": "200",
          "options": [],
          "hint": "3×60+20.",
          "solution": [
            "2 h = 120 min.",
            "120 + 35 = 155.",
            "Answer 155 min."
          ]
        },
        {
          "id": "ratio-proportion-s4-intermediate",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Convert 3 hours 20 minutes to minutes.",
          "answer": "200",
          "options": [],
          "hint": "3×60+20.",
          "solution": [
            "2 h = 120 min.",
            "120 + 35 = 155.",
            "Answer 155 min."
          ]
        },
        {
          "id": "ratio-proportion-s4-hard",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "hard",
          "prompt": "Convert 3 hours 20 minutes to minutes.",
          "answer": "200",
          "options": [],
          "hint": "3×60+20.",
          "solution": [
            "2 h = 120 min.",
            "120 + 35 = 155.",
            "Answer 155 min."
          ]
        }
      ]
    }
  ],
  "indices-standard-form": [
    {
      "id": "s1",
      "title": "Positive, zero and negative indices",
      "learningGoals": [
        "Explain and apply positive, zero and negative indices",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "a^m × a^n=a^(m+n); a^m/a^n=a^(m−n), a≠0; a⁰=1; a⁻ⁿ=1/aⁿ."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Simplify 2⁵ × 2⁻³.",
          "steps": [
            "Add indices 5 + (−3) = 2.",
            "2² = 4.",
            "Answer 4."
          ]
        }
      ],
      "questions": [
        {
          "id": "indices-standard-form-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Evaluate 5^0 + 2^3.",
          "answer": "9",
          "options": [],
          "hint": "5⁰ = 1.",
          "solution": [
            "Add indices 5 + (−3) = 2.",
            "2² = 4.",
            "Answer 4."
          ]
        },
        {
          "id": "indices-standard-form-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Evaluate 5^0 + 2^3.",
          "answer": "9",
          "options": [],
          "hint": "5⁰ = 1.",
          "solution": [
            "Add indices 5 + (−3) = 2.",
            "2² = 4.",
            "Answer 4."
          ]
        },
        {
          "id": "indices-standard-form-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "Evaluate 5^0 + 2^3.",
          "answer": "9",
          "options": [],
          "hint": "5⁰ = 1.",
          "solution": [
            "Add indices 5 + (−3) = 2.",
            "2² = 4.",
            "Answer 4."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Powers of powers",
      "learningGoals": [
        "Explain and apply powers of powers",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "(a^m)^n=a^(mn); (ab)^n=a^n b^n. Apply brackets carefully."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Simplify (x³)⁴.",
          "steps": [
            "Multiply exponents 3 × 4.",
            "Answer x¹²."
          ]
        }
      ],
      "questions": [
        {
          "id": "indices-standard-form-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Evaluate (2^3)^2.",
          "answer": "64",
          "options": [],
          "hint": "Multiply indices.",
          "solution": [
            "Multiply exponents 3 × 4.",
            "Answer x¹²."
          ]
        },
        {
          "id": "indices-standard-form-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Evaluate (2^3)^2.",
          "answer": "64",
          "options": [],
          "hint": "Multiply indices.",
          "solution": [
            "Multiply exponents 3 × 4.",
            "Answer x¹²."
          ]
        },
        {
          "id": "indices-standard-form-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "Evaluate (2^3)^2.",
          "answer": "64",
          "options": [],
          "hint": "Multiply indices.",
          "solution": [
            "Multiply exponents 3 × 4.",
            "Answer x¹²."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Standard form",
      "learningGoals": [
        "Explain and apply standard form",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Write a×10^n with 1≤|a|<10. Positive n means large values; negative n means small values."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Write 0.000072 in standard form.",
          "steps": [
            "Move the decimal 5 places right to get 7.2.",
            "Compensate with 10⁻⁵.",
            "7.2×10⁻⁵."
          ]
        }
      ],
      "questions": [
        {
          "id": "indices-standard-form-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "Write 560000 in standard form.",
          "answer": "5.6*10^5",
          "options": [],
          "hint": "Move decimal five places left.",
          "solution": [
            "Move the decimal 5 places right to get 7.2.",
            "Compensate with 10⁻⁵.",
            "7.2×10⁻⁵."
          ]
        },
        {
          "id": "indices-standard-form-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Write 560000 in standard form.",
          "answer": "5.6*10^5",
          "options": [],
          "hint": "Move decimal five places left.",
          "solution": [
            "Move the decimal 5 places right to get 7.2.",
            "Compensate with 10⁻⁵.",
            "7.2×10⁻⁵."
          ]
        },
        {
          "id": "indices-standard-form-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "Write 560000 in standard form.",
          "answer": "5.6*10^5",
          "options": [],
          "hint": "Move decimal five places left.",
          "solution": [
            "Move the decimal 5 places right to get 7.2.",
            "Compensate with 10⁻⁵.",
            "7.2×10⁻⁵."
          ]
        }
      ]
    }
  ],
  "degree-accuracy": [
    {
      "id": "s1",
      "title": "Lower and upper bounds",
      "learningGoals": [
        "Explain and apply lower and upper bounds",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "If x is rounded to nearest unit u, the true value lies in [x−u/2, x+u/2). Upper bound is excluded."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "A mass is 7.4 kg to nearest 0.1 kg.",
          "steps": [
            "Half unit = 0.05.",
            "7.35 ≤ m < 7.45.",
            "Lower 7.35, upper 7.45."
          ]
        }
      ],
      "questions": [
        {
          "id": "degree-accuracy-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Find upper bound of 8.2 rounded to nearest 0.1.",
          "answer": "8.25",
          "options": [],
          "hint": "Add 0.05.",
          "solution": [
            "Half unit = 0.05.",
            "7.35 ≤ m < 7.45.",
            "Lower 7.35, upper 7.45."
          ]
        },
        {
          "id": "degree-accuracy-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Find upper bound of 8.2 rounded to nearest 0.1.",
          "answer": "8.25",
          "options": [],
          "hint": "Add 0.05.",
          "solution": [
            "Half unit = 0.05.",
            "7.35 ≤ m < 7.45.",
            "Lower 7.35, upper 7.45."
          ]
        },
        {
          "id": "degree-accuracy-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "Find upper bound of 8.2 rounded to nearest 0.1.",
          "answer": "8.25",
          "options": [],
          "hint": "Add 0.05.",
          "solution": [
            "Half unit = 0.05.",
            "7.35 ≤ m < 7.45.",
            "Lower 7.35, upper 7.45."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Bounds in calculations",
      "learningGoals": [
        "Explain and apply bounds in calculations",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "For positive quantities, use lower×lower for minimum product and upper×upper for maximum. Division uses lower numerator/upper denominator for minimum."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Length 5±0.5 and width 3±0.5. Maximum area?",
          "steps": [
            "Upper length 5.5; upper width 3.5.",
            "5.5×3.5=19.25.",
            "The area is less than 19.25."
          ]
        }
      ],
      "questions": [
        {
          "id": "degree-accuracy-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Two lengths are 4 and 6 cm to nearest cm. Find upper bound of their sum.",
          "answer": "11",
          "options": [],
          "hint": "Add 4.5 and 6.5.",
          "solution": [
            "Upper length 5.5; upper width 3.5.",
            "5.5×3.5=19.25.",
            "The area is less than 19.25."
          ]
        },
        {
          "id": "degree-accuracy-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Two lengths are 4 and 6 cm to nearest cm. Find upper bound of their sum.",
          "answer": "11",
          "options": [],
          "hint": "Add 4.5 and 6.5.",
          "solution": [
            "Upper length 5.5; upper width 3.5.",
            "5.5×3.5=19.25.",
            "The area is less than 19.25."
          ]
        },
        {
          "id": "degree-accuracy-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "Two lengths are 4 and 6 cm to nearest cm. Find upper bound of their sum.",
          "answer": "11",
          "options": [],
          "hint": "Add 4.5 and 6.5.",
          "solution": [
            "Upper length 5.5; upper width 3.5.",
            "5.5×3.5=19.25.",
            "The area is less than 19.25."
          ]
        }
      ]
    }
  ],
  "sets-venn": [
    {
      "id": "s1",
      "title": "Set notation and cardinality",
      "learningGoals": [
        "Explain and apply set notation and cardinality",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Use ∈ for membership, ∉ for non-membership, ∪ for union, ∩ for intersection and n(A) for number of elements."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "A={2,4,6}, B={4,6,8}. Find A∩B.",
          "steps": [
            "Find elements present in both.",
            "4 and 6 occur in both.",
            "A∩B={4,6}."
          ]
        }
      ],
      "questions": [
        {
          "id": "sets-venn-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "A={1,2,3}, B={2,3,4}. Find n(A∩B).",
          "answer": "2",
          "options": [],
          "hint": "Count common elements.",
          "solution": [
            "Find elements present in both.",
            "4 and 6 occur in both.",
            "A∩B={4,6}."
          ]
        },
        {
          "id": "sets-venn-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "A has 22 members, B has 17, and 8 are in both. Find n(A∪B).",
          "answer": "31",
          "options": [],
          "hint": "Subtract the overlap once.",
          "solution": [
            "22+17−8=31."
          ]
        },
        {
          "id": "sets-venn-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "n(A∪B)=40, n(A)=28, n(B)=25. Find n(A∩B).",
          "answer": "13",
          "options": [],
          "hint": "Rearrange inclusion-exclusion.",
          "solution": [
            "28+25−40=13."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Complements and subsets",
      "learningGoals": [
        "Explain and apply complements and subsets",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "A′ means everything in the universal set U that is not in A. A⊆B means every member of A is also in B."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "U={1,2,3,4,5}, A={2,4}.",
          "steps": [
            "Remove members of A from U.",
            "Remaining {1,3,5}.",
            "A′={1,3,5}."
          ]
        }
      ],
      "questions": [
        {
          "id": "sets-venn-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "If n(U)=30 and n(A)=18, find n(A′).",
          "answer": "12",
          "options": [],
          "hint": "Subtract from the universal set.",
          "solution": [
            "Remove members of A from U.",
            "Remaining {1,3,5}.",
            "A′={1,3,5}."
          ]
        },
        {
          "id": "sets-venn-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "n(U)=65, n(A)=38. Find n(A′).",
          "answer": "27",
          "options": [],
          "hint": "Subtract from U.",
          "solution": [
            "65−38=27."
          ]
        },
        {
          "id": "sets-venn-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "n(U)=80, n(A)=44, n(B)=36, n(A∩B)=15. How many in neither?",
          "answer": "15",
          "options": [],
          "hint": "Find union first.",
          "solution": [
            "80−(44+36−15)=15."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Two-set Venn diagrams",
      "learningGoals": [
        "Explain and apply two-set venn diagrams",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Fill the overlap first, then exclusive regions, then the outside. Union counts the overlap only once."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "25 play football, 18 tennis, 8 both, 5 neither. Total?",
          "steps": [
            "Only football 17; only tennis 10.",
            "Union = 17+8+10 = 35.",
            "Total = 35+5 = 40."
          ]
        }
      ],
      "questions": [
        {
          "id": "sets-venn-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "n(A)=14, n(B)=12, n(A∩B)=5. Find n(A∪B).",
          "answer": "21",
          "options": [],
          "hint": "Add and subtract overlap.",
          "solution": [
            "Only football 17; only tennis 10.",
            "Union = 17+8+10 = 35.",
            "Total = 35+5 = 40."
          ]
        },
        {
          "id": "sets-venn-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "In 45 pupils, 24 take French, 21 take Spanish, 7 take neither. How many take both?",
          "answer": "7",
          "options": [],
          "hint": "Union = total − neither.",
          "solution": [
            "24+21−(45−7)=7."
          ]
        },
        {
          "id": "sets-venn-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "Of 100 people, 62 like tea, 48 like coffee, and 25 like neither. How many like both?",
          "answer": "35",
          "options": [],
          "hint": "Subtract union from sum.",
          "solution": [
            "62+48−75=35."
          ]
        }
      ]
    },
    {
      "id": "s4",
      "title": "Probability from Venn diagrams",
      "learningGoals": [
        "Explain and apply probability from venn diagrams",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Probability = favourable outcomes ÷ total equally likely outcomes. Include outside region in the denominator."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "A class has 30 pupils; 12 are in A only, 8 in both, 5 B only. P(A)?",
          "steps": [
            "A has 12+8=20.",
            "P(A)=20/30.",
            "Answer 2/3."
          ]
        }
      ],
      "questions": [
        {
          "id": "sets-venn-s4-simple",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "simple",
          "prompt": "Of 40 pupils, 18 are in A. Find P(A).",
          "answer": "9/20",
          "options": [],
          "hint": "18/40 simplifies.",
          "solution": [
            "A has 12+8=20.",
            "P(A)=20/30.",
            "Answer 2/3."
          ]
        },
        {
          "id": "sets-venn-s4-intermediate",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Of 50 students, 30 are in A, 25 in B, 15 in both. P(A∪B)?",
          "answer": "4/5",
          "options": [],
          "hint": "Count union then divide by 50.",
          "solution": [
            "(30+25−15)/50=40/50=4/5."
          ]
        },
        {
          "id": "sets-venn-s4-hard",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "hard",
          "prompt": "Of 80 people, 45 like A, 50 like B, 20 like neither. P(A∩B)?",
          "answer": "7/16",
          "options": [],
          "hint": "First find union=60.",
          "solution": [
            "Intersection=45+50−60=35; 35/80=7/16."
          ]
        }
      ]
    }
  ],
  "algebra": [
    {
      "id": "s1",
      "title": "Collecting like terms",
      "learningGoals": [
        "Explain and apply collecting like terms",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Combine terms with identical variable parts and powers. x and x² are not like terms."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Simplify 4x+3y−x+2y.",
          "steps": [
            "4x−x=3x.",
            "3y+2y=5y.",
            "Answer 3x+5y."
          ]
        }
      ],
      "questions": [
        {
          "id": "algebra-s1-simple",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "simple",
          "prompt": "Simplify 7x−3x.",
          "answer": "4*x",
          "options": [],
          "hint": "Subtract coefficients.",
          "solution": [
            "4x−x=3x.",
            "3y+2y=5y.",
            "Answer 3x+5y."
          ]
        },
        {
          "id": "algebra-s1-intermediate",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Simplify 7x−3x.",
          "answer": "4*x",
          "options": [],
          "hint": "Subtract coefficients.",
          "solution": [
            "4x−x=3x.",
            "3y+2y=5y.",
            "Answer 3x+5y."
          ]
        },
        {
          "id": "algebra-s1-hard",
          "subtopicId": "s1",
          "kind": "maths",
          "level": "hard",
          "prompt": "Simplify 7x−3x.",
          "answer": "4*x",
          "options": [],
          "hint": "Subtract coefficients.",
          "solution": [
            "4x−x=3x.",
            "3y+2y=5y.",
            "Answer 3x+5y."
          ]
        }
      ]
    },
    {
      "id": "s2",
      "title": "Single bracket expansion",
      "learningGoals": [
        "Explain and apply single bracket expansion",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Multiply each term in the bracket by the factor outside; watch negative signs."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Expand −3(2x−5).",
          "steps": [
            "−3×2x=−6x.",
            "−3×−5=+15.",
            "Answer −6x+15."
          ]
        }
      ],
      "questions": [
        {
          "id": "algebra-s2-simple",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "simple",
          "prompt": "Expand 4(x+3). Give constant term.",
          "answer": "12",
          "options": [],
          "hint": "Multiply four by three.",
          "solution": [
            "−3×2x=−6x.",
            "−3×−5=+15.",
            "Answer −6x+15."
          ]
        },
        {
          "id": "algebra-s2-intermediate",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Expand 4(x+3). Give constant term.",
          "answer": "12",
          "options": [],
          "hint": "Multiply four by three.",
          "solution": [
            "−3×2x=−6x.",
            "−3×−5=+15.",
            "Answer −6x+15."
          ]
        },
        {
          "id": "algebra-s2-hard",
          "subtopicId": "s2",
          "kind": "maths",
          "level": "hard",
          "prompt": "Expand 4(x+3). Give constant term.",
          "answer": "12",
          "options": [],
          "hint": "Multiply four by three.",
          "solution": [
            "−3×2x=−6x.",
            "−3×−5=+15.",
            "Answer −6x+15."
          ]
        }
      ]
    },
    {
      "id": "s3",
      "title": "Common factor factorisation",
      "learningGoals": [
        "Explain and apply common factor factorisation",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Find the highest common numerical and algebraic factor, then divide each term by it."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Factorise 12x²−18x.",
          "steps": [
            "HCF = 6x.",
            "12x²÷6x=2x, −18x÷6x=−3.",
            "Answer 6x(2x−3)."
          ]
        }
      ],
      "questions": [
        {
          "id": "algebra-s3-simple",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "simple",
          "prompt": "Factorise 6x+9. Give the common factor.",
          "answer": "3",
          "options": [],
          "hint": "HCF of 6 and 9.",
          "solution": [
            "HCF = 6x.",
            "12x²÷6x=2x, −18x÷6x=−3.",
            "Answer 6x(2x−3)."
          ]
        },
        {
          "id": "algebra-s3-intermediate",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Factorise 6x+9. Give the common factor.",
          "answer": "3",
          "options": [],
          "hint": "HCF of 6 and 9.",
          "solution": [
            "HCF = 6x.",
            "12x²÷6x=2x, −18x÷6x=−3.",
            "Answer 6x(2x−3)."
          ]
        },
        {
          "id": "algebra-s3-hard",
          "subtopicId": "s3",
          "kind": "maths",
          "level": "hard",
          "prompt": "Factorise 6x+9. Give the common factor.",
          "answer": "3",
          "options": [],
          "hint": "HCF of 6 and 9.",
          "solution": [
            "HCF = 6x.",
            "12x²÷6x=2x, −18x÷6x=−3.",
            "Answer 6x(2x−3)."
          ]
        }
      ]
    },
    {
      "id": "s4",
      "title": "Expanding two brackets",
      "learningGoals": [
        "Explain and apply expanding two brackets",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "Use a grid or distribute every term in the first bracket over every term in the second. Collect like terms."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Expand (x+3)(x−5).",
          "steps": [
            "x²−5x+3x−15.",
            "Combine middle terms.",
            "x²−2x−15."
          ]
        }
      ],
      "questions": [
        {
          "id": "algebra-s4-simple",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "simple",
          "prompt": "Expand (x+2)(x+3). Give constant term.",
          "answer": "6",
          "options": [],
          "hint": "Multiply constant terms.",
          "solution": [
            "x²−5x+3x−15.",
            "Combine middle terms.",
            "x²−2x−15."
          ]
        },
        {
          "id": "algebra-s4-intermediate",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Expand (x+2)(x+3). Give constant term.",
          "answer": "6",
          "options": [],
          "hint": "Multiply constant terms.",
          "solution": [
            "x²−5x+3x−15.",
            "Combine middle terms.",
            "x²−2x−15."
          ]
        },
        {
          "id": "algebra-s4-hard",
          "subtopicId": "s4",
          "kind": "maths",
          "level": "hard",
          "prompt": "Expand (x+2)(x+3). Give constant term.",
          "answer": "6",
          "options": [],
          "hint": "Multiply constant terms.",
          "solution": [
            "x²−5x+3x−15.",
            "Combine middle terms.",
            "x²−2x−15."
          ]
        }
      ]
    },
    {
      "id": "s5",
      "title": "Factorising quadratics",
      "learningGoals": [
        "Explain and apply factorising quadratics",
        "Solve a question without copying a worked example"
      ],
      "explanation": [
        "For x²+bx+c, find two numbers with sum b and product c. Check by expanding."
      ],
      "terms": [],
      "formulas": [],
      "examples": [
        {
          "prompt": "Factorise x²+7x+12.",
          "steps": [
            "Find 3 and 4: sum 7, product 12.",
            "Write (x+3)(x+4).",
            "Check expansion."
          ]
        }
      ],
      "questions": [
        {
          "id": "algebra-s5-simple",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "simple",
          "prompt": "Factorise x²+5x+6. Give the positive smaller root of factors as number.",
          "answer": "2",
          "options": [],
          "hint": "Look for 2 and 3.",
          "solution": [
            "Find 3 and 4: sum 7, product 12.",
            "Write (x+3)(x+4).",
            "Check expansion."
          ]
        },
        {
          "id": "algebra-s5-intermediate",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "intermediate",
          "prompt": "Factorise x²+5x+6. Give the positive smaller root of factors as number.",
          "answer": "2",
          "options": [],
          "hint": "Look for 2 and 3.",
          "solution": [
            "Find 3 and 4: sum 7, product 12.",
            "Write (x+3)(x+4).",
            "Check expansion."
          ]
        },
        {
          "id": "algebra-s5-hard",
          "subtopicId": "s5",
          "kind": "maths",
          "level": "hard",
          "prompt": "Factorise x²+5x+6. Give the positive smaller root of factors as number.",
          "answer": "2",
          "options": [],
          "hint": "Look for 2 and 3.",
          "solution": [
            "Find 3 and 4: sum 7, product 12.",
            "Write (x+3)(x+4).",
            "Check expansion."
          ]
        }
      ]
    }
  ],
  "living-organisms": [
    {
      "id": "s1",
      "title": "Seven life processes",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Living things carry out nutrition, respiration, movement, sensitivity, growth, reproduction and excretion (MRS GREN). Not every organism visibly performs every process at every moment.",
        "Respiration releases energy in cells; breathing is ventilation and is not the same thing. Excretion removes metabolic waste; egestion removes undigested food."
      ],
      "terms": [
        {
          "term": "respiration",
          "definition": "Chemical reactions in cells releasing energy from nutrients"
        },
        {
          "term": "excretion",
          "definition": "Removal of waste produced by metabolism"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Why is a dormant seed considered living?",
          "steps": [
            "It contains living cells.",
            "Metabolic activity can be extremely slow.",
            "Under suitable conditions it germinates and grows."
          ]
        }
      ],
      "questions": [
        {
          "id": "living-organisms-s1-simple",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which process removes metabolic waste?",
          "answer": "Excretion",
          "options": [
            "Excretion",
            "Egestion",
            "Nutrition",
            "Growth"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Excretion removes metabolic waste."
          ],
          "explanation": "Excretion removes metabolic waste."
        },
        {
          "id": "living-organisms-s1-intermediate",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "A plant does not move from place to place. Why is it still living?",
          "answer": "Its cells perform the other life processes and parts move in growth",
          "options": [
            "Its cells perform the other life processes and parts move in growth",
            "Plants do not respire",
            "Movement is the only life process",
            "Plants are not organisms"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Movement can include growth responses."
          ],
          "explanation": "Movement can include growth responses."
        },
        {
          "id": "living-organisms-s1-hard",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "hard",
          "prompt": "A student calls faeces an example of excretion. What is the best correction?",
          "answer": "Faeces are mainly egested undigested material",
          "options": [
            "Faeces are mainly egested undigested material",
            "Faeces are only carbon dioxide",
            "Egestion and excretion mean exactly the same",
            "Faeces are made in the lungs"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Egestion removes undigested food, not metabolic waste."
          ],
          "explanation": "Egestion removes undigested food, not metabolic waste."
        }
      ]
    },
    {
      "id": "s2",
      "title": "Classification and kingdoms",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Classification groups organisms by shared features and evolutionary relationships. The hierarchy is kingdom, phylum, class, order, family, genus, species.",
        "Common school models describe animals, plants, fungi, protoctists and prokaryotes. Modern taxonomy also uses three domains: Bacteria, Archaea and Eukarya. Viruses are not placed in these cellular kingdoms."
      ],
      "terms": [
        {
          "term": "species",
          "definition": "Organisms that can generally interbreed to produce fertile offspring"
        },
        {
          "term": "binomial name",
          "definition": "Scientific genus and species name"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "How does a binomial name help?",
          "steps": [
            "The first word names the genus.",
            "The second identifies the species.",
            "It avoids confusion between common names."
          ]
        }
      ],
      "questions": [
        {
          "id": "living-organisms-s2-simple",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which level is most specific?",
          "answer": "Species",
          "options": [
            "Species",
            "Kingdom",
            "Phylum",
            "Class"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Species is the most specific listed rank."
          ],
          "explanation": "Species is the most specific listed rank."
        },
        {
          "id": "living-organisms-s2-intermediate",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Two organisms share a genus. What follows?",
          "answer": "They are in the same family",
          "options": [
            "They are in the same family",
            "They must be the same species",
            "They have identical DNA",
            "They cannot interbreed"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "A genus is contained within a family."
          ],
          "explanation": "A genus is contained within a family."
        },
        {
          "id": "living-organisms-s2-hard",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why can DNA evidence alter a classification?",
          "answer": "It reveals evolutionary relationships not obvious from appearance",
          "options": [
            "It reveals evolutionary relationships not obvious from appearance",
            "DNA never changes",
            "Only size determines relationships",
            "DNA replaces the need for evidence"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Genetic similarity can challenge classifications based only on appearance."
          ],
          "explanation": "Genetic similarity can challenge classifications based only on appearance."
        }
      ]
    },
    {
      "id": "s3",
      "title": "Vertebrates and invertebrates",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Vertebrates have an internal backbone; mammals, birds, reptiles, amphibians and fish are familiar groups. Invertebrates lack a backbone and include arthropods, molluscs and annelids.",
        "Arthropods have jointed limbs and an exoskeleton. Insects have three body regions and six legs; arachnids have eight legs."
      ],
      "terms": [
        {
          "term": "vertebrate",
          "definition": "Animal with a backbone"
        },
        {
          "term": "exoskeleton",
          "definition": "External supporting skeleton"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Classify a spider.",
          "steps": [
            "A spider has jointed limbs and an exoskeleton.",
            "It has eight legs.",
            "It is an arachnid, not an insect."
          ]
        }
      ],
      "questions": [
        {
          "id": "living-organisms-s3-simple",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which animal is an invertebrate?",
          "answer": "Earthworm",
          "options": [
            "Earthworm",
            "Frog",
            "Salmon",
            "Lizard"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Earthworms lack backbones."
          ],
          "explanation": "Earthworms lack backbones."
        },
        {
          "id": "living-organisms-s3-intermediate",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "An animal has six legs and three body regions. What group is it?",
          "answer": "Insects",
          "options": [
            "Insects",
            "Arachnids",
            "Mammals",
            "Annelids"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "These are diagnostic insect features."
          ],
          "explanation": "These are diagnostic insect features."
        },
        {
          "id": "living-organisms-s3-hard",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why is a whale classified as a mammal rather than a fish?",
          "answer": "It breathes air with lungs and nurses young with milk",
          "options": [
            "It breathes air with lungs and nurses young with milk",
            "It lives in water",
            "It has fins",
            "It swims rapidly"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Habitat does not determine class; shared characteristics do."
          ],
          "explanation": "Habitat does not determine class; shared characteristics do."
        }
      ]
    },
    {
      "id": "s4",
      "title": "Biodiversity and sampling",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Biodiversity includes genetic, species and ecosystem diversity. Greater diversity can support ecosystem resilience, though resilience also depends on relationships and conditions.",
        "Use quadrats to estimate abundance of plants or slow-moving organisms. Random sampling reduces selection bias; repeat samples and calculate a mean."
      ],
      "terms": [
        {
          "term": "quadrat",
          "definition": "Frame used to sample organisms in a known area"
        },
        {
          "term": "bias",
          "definition": "Systematic influence making results unrepresentative"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Estimate daisies from quadrats.",
          "steps": [
            "Count daisies in several randomly placed quadrats.",
            "Calculate the mean count per quadrat.",
            "Scale by total habitat area if appropriate."
          ]
        }
      ],
      "questions": [
        {
          "id": "living-organisms-s4-simple",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which method samples grassland plants?",
          "answer": "Quadrat",
          "options": [
            "Quadrat",
            "Thermometer",
            "Microscope slide",
            "Barometer"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Quadrats sample organisms in an area."
          ],
          "explanation": "Quadrats sample organisms in an area."
        },
        {
          "id": "living-organisms-s4-intermediate",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why place quadrats at random?",
          "answer": "To reduce selection bias",
          "options": [
            "To reduce selection bias",
            "To guarantee equal numbers",
            "To increase species artificially",
            "To avoid calculating a mean"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Random placement makes samples more representative."
          ],
          "explanation": "Random placement makes samples more representative."
        },
        {
          "id": "living-organisms-s4-hard",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "hard",
          "prompt": "A habitat has 120 plants in ten 1 m² quadrats across 200 m². Estimated plants?",
          "answer": "2400",
          "options": [
            "2400",
            "120",
            "200",
            "1200"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Mean 12 per m² times 200 m² = 2400."
          ],
          "explanation": "Mean 12 per m² times 200 m² = 2400."
        }
      ]
    }
  ],
  "cell-structure": [
    {
      "id": "s1",
      "title": "Animal and plant cells",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "The cell membrane is a selectively permeable boundary. Cytoplasm contains enzymes and is the site of many reactions. The nucleus contains DNA; ribosomes make proteins.",
        "Mitochondria carry out aerobic respiration. Plant cells usually have a cellulose cell wall, large permanent vacuole containing cell sap and chloroplasts in photosynthetic tissues. Not all plant cells have chloroplasts (for example root hair cells)."
      ],
      "terms": [
        {
          "term": "organelle",
          "definition": "Specialised structure within a cell"
        },
        {
          "term": "selectively permeable",
          "definition": "Allows some substances through more readily than others"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Why do root hair cells lack chloroplasts?",
          "steps": [
            "Root hair cells are underground and receive little light.",
            "Their function is absorbing water and mineral ions.",
            "They do not need chloroplasts for that role."
          ]
        }
      ],
      "questions": [
        {
          "id": "cell-structure-s1-simple",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "simple",
          "prompt": "Where is most aerobic respiration in eukaryotic cells?",
          "answer": "Mitochondria",
          "options": [
            "Mitochondria",
            "Ribosomes",
            "Cell wall",
            "Vacuole"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Mitochondria are the major site of aerobic respiration."
          ],
          "explanation": "Mitochondria are the major site of aerobic respiration."
        },
        {
          "id": "cell-structure-s1-intermediate",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why does a palisade cell have many chloroplasts?",
          "answer": "To absorb more light for photosynthesis",
          "options": [
            "To absorb more light for photosynthesis",
            "To pump blood",
            "To store DNA",
            "To prevent osmosis"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Chloroplasts contain chlorophyll and support photosynthesis."
          ],
          "explanation": "Chloroplasts contain chlorophyll and support photosynthesis."
        },
        {
          "id": "cell-structure-s1-hard",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "hard",
          "prompt": "Which structure can be found in both plant and animal cells but is absent from prokaryotes?",
          "answer": "Membrane-bound nucleus",
          "options": [
            "Membrane-bound nucleus",
            "Cell membrane",
            "Ribosomes",
            "Cytoplasm"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Prokaryotes have no membrane-bound nucleus."
          ],
          "explanation": "Prokaryotes have no membrane-bound nucleus."
        }
      ]
    },
    {
      "id": "s2",
      "title": "Specialised cells and adaptations",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Cells become specialised by differentiation. Red blood cells have a biconcave shape and lack a nucleus at maturity, leaving space for haemoglobin. Nerve cells have long axons and connections to transmit impulses.",
        "Root hair cells have an extended surface area for absorption; sperm cells have a flagellum and many mitochondria. Adaptations must be linked to their function, not just listed."
      ],
      "terms": [
        {
          "term": "differentiation",
          "definition": "Development of specialised cell structure and function"
        },
        {
          "term": "surface area",
          "definition": "Area exposed to surroundings for exchange"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Explain the root hair adaptation.",
          "steps": [
            "Long projection increases surface area.",
            "More membrane is available for water and mineral uptake.",
            "Mitochondria supply ATP for active mineral transport."
          ]
        }
      ],
      "questions": [
        {
          "id": "cell-structure-s2-simple",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which cell carries oxygen?",
          "answer": "Red blood cell",
          "options": [
            "Red blood cell",
            "Palisade cell",
            "Root hair cell",
            "Neuron"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Haemoglobin in red blood cells carries oxygen."
          ],
          "explanation": "Haemoglobin in red blood cells carries oxygen."
        },
        {
          "id": "cell-structure-s2-intermediate",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why do sperm cells contain many mitochondria?",
          "answer": "They release energy needed for swimming",
          "options": [
            "They release energy needed for swimming",
            "They store chlorophyll",
            "They make cellulose",
            "They prevent diffusion"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Movement of the flagellum needs ATP."
          ],
          "explanation": "Movement of the flagellum needs ATP."
        },
        {
          "id": "cell-structure-s2-hard",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why is the biconcave shape useful for red blood cells?",
          "answer": "It increases surface-area-to-volume ratio and shortens diffusion distance",
          "options": [
            "It increases surface-area-to-volume ratio and shortens diffusion distance",
            "It makes the cell photosynthesise",
            "It makes the cell divide faster",
            "It prevents oxygen entering"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "A thin biconcave disc promotes gas exchange."
          ],
          "explanation": "A thin biconcave disc promotes gas exchange."
        }
      ]
    },
    {
      "id": "s3",
      "title": "Tissues, organs and systems",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Similar specialised cells working together form a tissue. Several tissues form an organ; organs working together form an organ system.",
        "Example: muscle tissue, nerve tissue and connective tissue contribute to the heart. The heart belongs to the circulatory system with blood vessels and blood."
      ],
      "terms": [
        {
          "term": "tissue",
          "definition": "Group of similar cells carrying out a function"
        },
        {
          "term": "organ",
          "definition": "Structure containing multiple tissues working together"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Trace a hierarchy.",
          "steps": [
            "Cardiac muscle cell → cardiac muscle tissue.",
            "Tissues combine to make the heart.",
            "Heart and blood vessels contribute to the circulatory system."
          ]
        }
      ],
      "questions": [
        {
          "id": "cell-structure-s3-simple",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which comes immediately after tissue?",
          "answer": "Organ",
          "options": [
            "Organ",
            "Cell",
            "Organism",
            "Organelle"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Tissues combine into organs."
          ],
          "explanation": "Tissues combine into organs."
        },
        {
          "id": "cell-structure-s3-intermediate",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why is a leaf an organ?",
          "answer": "It contains several tissues performing coordinated functions",
          "options": [
            "It contains several tissues performing coordinated functions",
            "It is made of one cell",
            "It contains only xylem",
            "It has no differentiated cells"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Leaves include epidermal, mesophyll and vascular tissues."
          ],
          "explanation": "Leaves include epidermal, mesophyll and vascular tissues."
        },
        {
          "id": "cell-structure-s3-hard",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "hard",
          "prompt": "Which ordering is correct?",
          "answer": "Cell → tissue → organ → organ system",
          "options": [
            "Cell → tissue → organ → organ system",
            "Organ → cell → tissue → system",
            "Tissue → cell → system → organ",
            "Cell → organ system → tissue → organ"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Biological organisation proceeds from cells upward."
          ],
          "explanation": "Biological organisation proceeds from cells upward."
        }
      ]
    },
    {
      "id": "s4",
      "title": "Microscopy and magnification",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Magnification = image size ÷ actual size, with both lengths in the same units. 1 mm = 1000 µm. Rearrange: actual size = image size ÷ magnification.",
        "Magnification tells how much larger an image appears. Resolution is the ability to distinguish two nearby points as separate; higher magnification alone does not guarantee higher resolution."
      ],
      "terms": [
        {
          "term": "magnification",
          "definition": "Image size divided by actual size"
        },
        {
          "term": "resolution",
          "definition": "Ability to distinguish closely spaced details"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "An image is 36 mm long; actual cell 24 µm.",
          "steps": [
            "Convert 36 mm to 36000 µm.",
            "36000 ÷ 24 = 1500.",
            "Magnification ×1500."
          ]
        }
      ],
      "questions": [
        {
          "id": "cell-structure-s4-simple",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "simple",
          "prompt": "A 20 µm cell appears 40 mm wide. Magnification?",
          "answer": "×2000",
          "options": [
            "×2000",
            "×20",
            "×200",
            "×20000"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "40 mm = 40000 µm; divide by 20."
          ],
          "explanation": "40 mm = 40000 µm; divide by 20."
        },
        {
          "id": "cell-structure-s4-intermediate",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "A drawing is 45 mm wide at ×1500. Actual width?",
          "answer": "30 µm",
          "options": [
            "30 µm",
            "300 µm",
            "3 µm",
            "3000 µm"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "45000 µm divided by 1500 is 30 µm."
          ],
          "explanation": "45000 µm divided by 1500 is 30 µm."
        },
        {
          "id": "cell-structure-s4-hard",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why might increasing magnification not reveal more detail?",
          "answer": "Resolution may be insufficient to distinguish closer structures",
          "options": [
            "Resolution may be insufficient to distinguish closer structures",
            "Cells stop existing",
            "The field of view always increases",
            "Magnification destroys DNA"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Resolution limits separable detail."
          ],
          "explanation": "Resolution limits separable detail."
        }
      ]
    }
  ],
  "cell-movement": [
    {
      "id": "s1",
      "title": "Diffusion and concentration gradients",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Diffusion is net movement of particles from higher concentration to lower concentration because of random motion. Particles move in both directions; net movement decreases as equilibrium approaches.",
        "Diffusion is passive and requires no ATP. Exchange surfaces are often thin, large and well supplied to maintain a gradient."
      ],
      "terms": [
        {
          "term": "diffusion",
          "definition": "Net movement down a concentration gradient"
        },
        {
          "term": "equilibrium",
          "definition": "No net concentration change despite random motion"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Why does perfume spread?",
          "steps": [
            "Molecules move randomly in air.",
            "More molecules initially leave the high-concentration region.",
            "Eventually distribution becomes more even."
          ]
        }
      ],
      "questions": [
        {
          "id": "cell-movement-s1-simple",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "simple",
          "prompt": "Does diffusion require ATP?",
          "answer": "No",
          "options": [
            "No",
            "Yes always",
            "Only in plants",
            "Only in animals"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Diffusion is passive."
          ],
          "explanation": "Diffusion is passive."
        },
        {
          "id": "cell-movement-s1-intermediate",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "At equilibrium, what happens to particles?",
          "answer": "They still move randomly but with no net transfer",
          "options": [
            "They still move randomly but with no net transfer",
            "All movement stops",
            "All move in one direction",
            "They disappear"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Dynamic equilibrium means random motion continues."
          ],
          "explanation": "Dynamic equilibrium means random motion continues."
        },
        {
          "id": "cell-movement-s1-hard",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why does a thin alveolar wall increase oxygen diffusion?",
          "answer": "It shortens the diffusion distance",
          "options": [
            "It shortens the diffusion distance",
            "It increases oxygen mass",
            "It makes diffusion active",
            "It stops carbon dioxide moving"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Short diffusion distance increases rate."
          ],
          "explanation": "Short diffusion distance increases rate."
        }
      ]
    },
    {
      "id": "s2",
      "title": "Osmosis and water potential",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Osmosis is net movement of water through a partially permeable membrane from higher water potential to lower water potential. In simpler terms, water moves from a more dilute solution to a more concentrated one, where solutes cannot freely cross.",
        "Plant cells become turgid when water enters; in concentrated solution they lose water and can become plasmolysed. Animal cells lack a cell wall and may swell or shrink."
      ],
      "terms": [
        {
          "term": "osmosis",
          "definition": "Net water movement across a partially permeable membrane down a water potential gradient"
        },
        {
          "term": "turgor",
          "definition": "Pressure of cell contents against the cell wall"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Explain a wilted plant recovering.",
          "steps": [
            "Water enters root cells by osmosis.",
            "Water travels to leaves via xylem.",
            "Vacuoles swell and cells regain turgor."
          ]
        }
      ],
      "questions": [
        {
          "id": "cell-movement-s2-simple",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "simple",
          "prompt": "What moves during osmosis?",
          "answer": "Water molecules",
          "options": [
            "Water molecules",
            "Only salt ions",
            "Only glucose",
            "Only oxygen"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Osmosis describes water movement."
          ],
          "explanation": "Osmosis describes water movement."
        },
        {
          "id": "cell-movement-s2-intermediate",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "A plant cell is placed in concentrated salt solution. What happens?",
          "answer": "Water leaves and the membrane may pull from the wall",
          "options": [
            "Water leaves and the membrane may pull from the wall",
            "It becomes more turgid",
            "Chloroplasts multiply immediately",
            "The cell wall dissolves"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Water leaves by osmosis causing plasmolysis."
          ],
          "explanation": "Water leaves by osmosis causing plasmolysis."
        },
        {
          "id": "cell-movement-s2-hard",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why does salting a slug cause water loss?",
          "answer": "The external solution has lower water potential, so water leaves its cells",
          "options": [
            "The external solution has lower water potential, so water leaves its cells",
            "Salt creates water inside cells",
            "Salt causes photosynthesis",
            "The slug has a cellulose wall"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Water moves towards lower water potential."
          ],
          "explanation": "Water moves towards lower water potential."
        }
      ]
    },
    {
      "id": "s3",
      "title": "Active transport",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Active transport moves substances against their concentration gradient, using energy supplied by ATP and membrane carrier proteins. It differs from diffusion because the direction can be from low to high concentration.",
        "Root hair cells actively take up mineral ions from dilute soil. Intestinal cells can absorb glucose even when its concentration is lower in the gut than in the cells."
      ],
      "terms": [
        {
          "term": "active transport",
          "definition": "Energy-dependent movement against a concentration gradient"
        },
        {
          "term": "carrier protein",
          "definition": "Membrane protein that transports specific molecules or ions"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Why do root hair cells have mitochondria?",
          "steps": [
            "Mineral uptake can require active transport.",
            "Carrier proteins move ions against the gradient.",
            "Mitochondria release energy to make ATP."
          ]
        }
      ],
      "questions": [
        {
          "id": "cell-movement-s3-simple",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which process needs energy to move ions uphill?",
          "answer": "Active transport",
          "options": [
            "Active transport",
            "Diffusion",
            "Osmosis",
            "Evaporation"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Active transport uses ATP."
          ],
          "explanation": "Active transport uses ATP."
        },
        {
          "id": "cell-movement-s3-intermediate",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "What happens to active uptake if respiration is inhibited?",
          "answer": "It usually decreases because less ATP is available",
          "options": [
            "It usually decreases because less ATP is available",
            "It always increases",
            "It is unaffected by ATP",
            "The cell wall pumps ions"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Active uptake depends on ATP supply."
          ],
          "explanation": "Active uptake depends on ATP supply."
        },
        {
          "id": "cell-movement-s3-hard",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "hard",
          "prompt": "Mineral ions enter a root cell despite being more concentrated inside. Which explains this?",
          "answer": "Specific carrier proteins and ATP",
          "options": [
            "Specific carrier proteins and ATP",
            "Simple diffusion alone",
            "Osmosis of ions",
            "Water evaporating from soil"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Transport against the gradient requires energy."
          ],
          "explanation": "Transport against the gradient requires energy."
        }
      ]
    },
    {
      "id": "s4",
      "title": "Factors affecting exchange rates",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "A steeper concentration gradient, larger surface area and shorter diffusion distance increase diffusion rate. Higher temperature usually increases random particle motion.",
        "Surface-area-to-volume ratio decreases as a cell becomes larger; this limits efficient exchange and helps explain why multicellular organisms need specialised transport systems."
      ],
      "terms": [
        {
          "term": "surface-area-to-volume ratio",
          "definition": "Exchange surface relative to the volume requiring supplies"
        },
        {
          "term": "diffusion distance",
          "definition": "Thickness through which molecules must travel"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Compare two cubes.",
          "steps": [
            "A 1 cm cube has area 6 cm² and volume 1 cm³, ratio 6:1.",
            "A 2 cm cube has area 24 cm² and volume 8 cm³, ratio 3:1.",
            "The larger cube has a lower surface-area-to-volume ratio."
          ]
        }
      ],
      "questions": [
        {
          "id": "cell-movement-s4-simple",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which change speeds diffusion?",
          "answer": "Greater concentration gradient",
          "options": [
            "Greater concentration gradient",
            "Thicker membrane",
            "Lower surface area",
            "Smaller gradient"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Steeper gradients increase net diffusion."
          ],
          "explanation": "Steeper gradients increase net diffusion."
        },
        {
          "id": "cell-movement-s4-intermediate",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why are alveoli numerous?",
          "answer": "They provide a large exchange surface",
          "options": [
            "They provide a large exchange surface",
            "They increase diffusion distance",
            "They stop blood flow",
            "They consume oxygen"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Large surface area increases gas exchange."
          ],
          "explanation": "Large surface area increases gas exchange."
        },
        {
          "id": "cell-movement-s4-hard",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "hard",
          "prompt": "What is SA:V for a cube of side 3 cm?",
          "answer": "2:1",
          "options": [
            "2:1",
            "6:1",
            "3:1",
            "1:3"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Area 54 cm²; volume 27 cm³; ratio 2:1."
          ],
          "explanation": "Area 54 cm²; volume 27 cm³; ratio 2:1."
        }
      ]
    }
  ],
  "molecules-enzymes": [
    {
      "id": "s1",
      "title": "Carbohydrates, proteins and lipids",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Carbohydrates contain sugars and starches used for energy and storage. Proteins are chains of amino acids used in growth, repair and enzymes. Lipids include fats and oils used for energy storage, insulation and cell membranes.",
        "A balanced diet includes these nutrients as well as vitamins, minerals, fibre and water."
      ],
      "terms": [
        {
          "term": "amino acid",
          "definition": "Building block of a protein"
        },
        {
          "term": "lipid",
          "definition": "Group of water-insoluble molecules including fats and oils"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Why does a growing teenager need protein?",
          "steps": [
            "Proteins supply amino acids.",
            "Cells use them to build new proteins.",
            "These support growth and tissue repair."
          ]
        }
      ],
      "questions": [
        {
          "id": "molecules-enzymes-s1-simple",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "simple",
          "prompt": "What are proteins made from?",
          "answer": "Amino acids",
          "options": [
            "Amino acids",
            "Fatty acids only",
            "Glucose only",
            "Starch grains"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Proteins are amino-acid polymers."
          ],
          "explanation": "Proteins are amino-acid polymers."
        },
        {
          "id": "molecules-enzymes-s1-intermediate",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why is glycogen useful in animals?",
          "answer": "It stores glucose in a compact form",
          "options": [
            "It stores glucose in a compact form",
            "It is the main cell wall material",
            "It carries oxygen",
            "It is a digestive enzyme"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Glycogen stores carbohydrate in animals."
          ],
          "explanation": "Glycogen stores carbohydrate in animals."
        },
        {
          "id": "molecules-enzymes-s1-hard",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "hard",
          "prompt": "Which pair best describes a phospholipid?",
          "answer": "Hydrophilic head and hydrophobic tails",
          "options": [
            "Hydrophilic head and hydrophobic tails",
            "Two identical hydrophilic tails",
            "A DNA double helix",
            "A chain of glucose only"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Phospholipids form bilayers due to their dual affinities."
          ],
          "explanation": "Phospholipids form bilayers due to their dual affinities."
        }
      ]
    },
    {
      "id": "s2",
      "title": "Enzymes and specificity",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Enzymes are biological catalysts, mostly proteins, that speed reactions without being used up. The active site binds a suitable substrate, forming an enzyme–substrate complex.",
        "Lock-and-key is a useful introductory model; induced fit better describes the active site changing shape during binding. Enzymes are specific because active sites differ."
      ],
      "terms": [
        {
          "term": "catalyst",
          "definition": "Substance that increases reaction rate without being consumed"
        },
        {
          "term": "active site",
          "definition": "Region of an enzyme where substrate binds"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Describe amylase action.",
          "steps": [
            "Starch binds to amylase at the active site.",
            "The enzyme catalyses starch breakdown.",
            "Products leave and enzyme can work again."
          ]
        }
      ],
      "questions": [
        {
          "id": "molecules-enzymes-s2-simple",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "simple",
          "prompt": "What is a substrate?",
          "answer": "Molecule an enzyme acts upon",
          "options": [
            "Molecule an enzyme acts upon",
            "The final waste only",
            "The active site itself",
            "A type of cell wall"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Substrate binds at the active site."
          ],
          "explanation": "Substrate binds at the active site."
        },
        {
          "id": "molecules-enzymes-s2-intermediate",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why can an enzyme be reused?",
          "answer": "It is not consumed in the catalysed reaction",
          "options": [
            "It is not consumed in the catalysed reaction",
            "It becomes the product",
            "It disappears after one reaction",
            "It changes into ATP"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Catalysts are not used up."
          ],
          "explanation": "Catalysts are not used up."
        },
        {
          "id": "molecules-enzymes-s2-hard",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "hard",
          "prompt": "What improves on the lock-and-key model?",
          "answer": "Induced fit accounts for active-site shape changes",
          "options": [
            "Induced fit accounts for active-site shape changes",
            "All substrates fit all enzymes",
            "Enzymes contain no proteins",
            "Products bind permanently"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Induced fit captures flexible enzyme structure."
          ],
          "explanation": "Induced fit captures flexible enzyme structure."
        }
      ]
    },
    {
      "id": "s3",
      "title": "Temperature and pH effects",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Increasing temperature initially raises collision frequency and enzyme activity. Beyond an optimum, heat disrupts bonds maintaining the active-site shape, reducing activity through denaturation.",
        "Extreme pH also alters charges and bonds. Different enzymes have different optima: stomach pepsin works in acidic conditions, whereas many intestinal enzymes work in alkaline conditions."
      ],
      "terms": [
        {
          "term": "denaturation",
          "definition": "Loss of functional three-dimensional protein shape"
        },
        {
          "term": "optimum",
          "definition": "Condition producing the highest activity under given circumstances"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Why does activity fall above optimum?",
          "steps": [
            "Heat disrupts protein interactions.",
            "The active site changes shape.",
            "Substrate binds less effectively."
          ]
        }
      ],
      "questions": [
        {
          "id": "molecules-enzymes-s3-simple",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "simple",
          "prompt": "What happens at an enzyme optimum?",
          "answer": "Activity is greatest under those conditions",
          "options": [
            "Activity is greatest under those conditions",
            "All enzymes are destroyed",
            "No substrate binds",
            "pH becomes zero"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Optimum means highest activity."
          ],
          "explanation": "Optimum means highest activity."
        },
        {
          "id": "molecules-enzymes-s3-intermediate",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why does boiling often stop enzyme activity?",
          "answer": "Protein structure and active site become disrupted",
          "options": [
            "Protein structure and active site become disrupted",
            "Substrate concentration becomes infinite",
            "Enzymes turn into glucose",
            "Temperature becomes too low"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "High heat denatures many enzymes."
          ],
          "explanation": "High heat denatures many enzymes."
        },
        {
          "id": "molecules-enzymes-s3-hard",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why should enzyme experiments control pH?",
          "answer": "pH independently changes active-site shape and activity",
          "options": [
            "pH independently changes active-site shape and activity",
            "pH never affects enzymes",
            "pH changes only the colour of tubes",
            "pH replaces the substrate"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Control variables isolate temperature effects."
          ],
          "explanation": "Control variables isolate temperature effects."
        }
      ]
    },
    {
      "id": "s4",
      "title": "Food tests and experimental controls",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Iodine turns blue-black with starch. Benedict’s solution with heating changes from blue towards green, yellow, orange or brick-red when reducing sugars are present.",
        "Biuret reagent changes from blue to lilac for protein. Ethanol emulsion test forms a cloudy white emulsion for lipids. Use clean equipment, controls and suitable safety procedures; Benedict’s heating uses a water bath."
      ],
      "terms": [
        {
          "term": "reagent",
          "definition": "Chemical used to detect a substance"
        },
        {
          "term": "control",
          "definition": "Comparison showing whether a change is caused by the tested variable"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Test an unknown food for starch.",
          "steps": [
            "Add iodine solution to a small sample.",
            "Observe colour.",
            "Blue-black indicates starch; brown/orange means negative."
          ]
        }
      ],
      "questions": [
        {
          "id": "molecules-enzymes-s4-simple",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which reagent tests starch?",
          "answer": "Iodine",
          "options": [
            "Iodine",
            "Biuret",
            "Ethanol",
            "Limewater"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Iodine changes to blue-black with starch."
          ],
          "explanation": "Iodine changes to blue-black with starch."
        },
        {
          "id": "molecules-enzymes-s4-intermediate",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "A heated Benedict’s sample turns orange. What is present?",
          "answer": "Reducing sugar",
          "options": [
            "Reducing sugar",
            "Protein only",
            "Starch only",
            "Lipid only"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Benedict’s gives a coloured precipitate with reducing sugars."
          ],
          "explanation": "Benedict’s gives a coloured precipitate with reducing sugars."
        },
        {
          "id": "molecules-enzymes-s4-hard",
          "subtopicId": "s4",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why heat Benedict’s tubes in a water bath?",
          "answer": "For controlled, safer heating",
          "options": [
            "For controlled, safer heating",
            "To create glucose from water",
            "To prevent all reactions",
            "To test protein instead"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "A water bath controls heating and reduces direct-flame hazards."
          ],
          "explanation": "A water bath controls heating and reduces direct-flame hazards."
        }
      ]
    }
  ],
  "plant-nutrition": [
    {
      "id": "s1",
      "title": "Photosynthesis equations",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Photosynthesis converts light energy to chemical energy. Carbon dioxide and water produce glucose and oxygen in the presence of light and chlorophyll.",
        "Balanced equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Plants use glucose in respiration, convert it to starch for storage and build cellulose."
      ],
      "terms": [
        {
          "term": "photosynthesis",
          "definition": "Light-driven production of glucose from carbon dioxide and water"
        },
        {
          "term": "chlorophyll",
          "definition": "Pigment that absorbs light energy"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Balance the photosynthesis equation.",
          "steps": [
            "Count 6 carbon atoms in glucose.",
            "Use 6 CO₂ and 6 H₂O.",
            "Products include 6 O₂ to balance oxygen."
          ]
        }
      ],
      "questions": [
        {
          "id": "plant-nutrition-s1-simple",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which gas is absorbed during photosynthesis?",
          "answer": "Carbon dioxide",
          "options": [
            "Carbon dioxide",
            "Oxygen only",
            "Nitrogen",
            "Hydrogen"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Carbon dioxide supplies carbon for glucose."
          ],
          "explanation": "Carbon dioxide supplies carbon for glucose."
        },
        {
          "id": "plant-nutrition-s1-intermediate",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why does a plant store some glucose as starch?",
          "answer": "Starch is less soluble and suitable for storage",
          "options": [
            "Starch is less soluble and suitable for storage",
            "Starch diffuses out rapidly",
            "Starch is a gas",
            "Starch is needed for chlorophyll colour only"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Insoluble starch is useful for storage."
          ],
          "explanation": "Insoluble starch is useful for storage."
        },
        {
          "id": "plant-nutrition-s1-hard",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "hard",
          "prompt": "What happens to light energy in photosynthesis?",
          "answer": "It is converted to chemical energy in organic molecules",
          "options": [
            "It is converted to chemical energy in organic molecules",
            "It is created from nothing",
            "It becomes only sound",
            "It is destroyed"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Energy is transformed, not created."
          ],
          "explanation": "Energy is transformed, not created."
        }
      ]
    },
    {
      "id": "s2",
      "title": "Chloroplasts and leaf adaptations",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Chloroplasts contain chlorophyll in thylakoid membranes; stroma contains enzymes for carbon fixation. Palisade cells near the upper leaf surface have many chloroplasts.",
        "Broad thin leaves expose a large area to light, reduce diffusion distance and contain stomata for gas exchange. Air spaces in spongy mesophyll allow gas diffusion."
      ],
      "terms": [
        {
          "term": "stoma",
          "definition": "Pore in epidermis controlling gas exchange"
        },
        {
          "term": "palisade mesophyll",
          "definition": "Photosynthetic tissue near upper leaf surface"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Explain leaf structure.",
          "steps": [
            "Broad blade absorbs more light.",
            "Palisade cells have many chloroplasts.",
            "Stomata and air spaces allow CO₂ to reach cells."
          ]
        }
      ],
      "questions": [
        {
          "id": "plant-nutrition-s2-simple",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which leaf cells typically contain many chloroplasts?",
          "answer": "Palisade mesophyll",
          "options": [
            "Palisade mesophyll",
            "Xylem vessels",
            "Root hairs",
            "Cork cells"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Palisade cells are adapted to absorb light."
          ],
          "explanation": "Palisade cells are adapted to absorb light."
        },
        {
          "id": "plant-nutrition-s2-intermediate",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why is a leaf usually thin?",
          "answer": "Short diffusion distance for gases",
          "options": [
            "Short diffusion distance for gases",
            "To stop all water loss",
            "To prevent light absorption",
            "To remove chloroplasts"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Thin tissues support faster diffusion."
          ],
          "explanation": "Thin tissues support faster diffusion."
        },
        {
          "id": "plant-nutrition-s2-hard",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why are stomata often more numerous below a leaf?",
          "answer": "They allow gas exchange while limiting direct exposure and water loss",
          "options": [
            "They allow gas exchange while limiting direct exposure and water loss",
            "They create glucose directly",
            "They prevent oxygen release",
            "They transport sugars in phloem"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Stomatal distribution balances exchange and water loss."
          ],
          "explanation": "Stomatal distribution balances exchange and water loss."
        }
      ]
    },
    {
      "id": "s3",
      "title": "Limiting factors and experiments",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Light intensity, carbon dioxide concentration and temperature can limit photosynthesis. Increasing a factor helps only until another factor becomes limiting.",
        "Investigate with pondweed and measure oxygen production while controlling temperature, CO₂ and distance from the lamp. Bubble count is a rough proxy because bubble sizes vary."
      ],
      "terms": [
        {
          "term": "limiting factor",
          "definition": "Factor in shortest supply relative to demand, restricting rate"
        },
        {
          "term": "control variable",
          "definition": "Factor kept constant for a fair test"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Interpret a plateau in a graph.",
          "steps": [
            "Rate rises as light intensity increases.",
            "At the plateau, more light has no effect.",
            "CO₂ or temperature may now limit the rate."
          ]
        }
      ],
      "questions": [
        {
          "id": "plant-nutrition-s3-simple",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which factor can limit photosynthesis?",
          "answer": "Carbon dioxide concentration",
          "options": [
            "Carbon dioxide concentration",
            "Blood pressure",
            "Bone density",
            "Heart rate"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "CO₂ is a photosynthesis reactant."
          ],
          "explanation": "CO₂ is a photosynthesis reactant."
        },
        {
          "id": "plant-nutrition-s3-intermediate",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "A graph plateaus despite more light. Why?",
          "answer": "Another factor has become limiting",
          "options": [
            "Another factor has become limiting",
            "Photosynthesis always stops at noon",
            "Light has become food",
            "Oxygen is no longer made"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Increasing one factor cannot overcome another limit."
          ],
          "explanation": "Increasing one factor cannot overcome another limit."
        },
        {
          "id": "plant-nutrition-s3-hard",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why might counting bubbles give inaccurate oxygen volumes?",
          "answer": "Bubble sizes vary",
          "options": [
            "Bubble sizes vary",
            "Bubbles are always equal",
            "Water has no oxygen",
            "Plants never respire"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Different bubble volumes make counts approximate."
          ],
          "explanation": "Different bubble volumes make counts approximate."
        }
      ]
    }
  ],
  "plant-transport": [
    {
      "id": "s1",
      "title": "Root uptake and xylem",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Root hair cells increase surface area for uptake. Water enters mainly by osmosis and moves through root tissues into xylem.",
        "Xylem vessels are dead, hollow cells with lignified walls. They carry water and mineral ions mainly upwards and help support the plant."
      ],
      "terms": [
        {
          "term": "xylem",
          "definition": "Tissue transporting water and mineral ions"
        },
        {
          "term": "lignin",
          "definition": "Strengthening material in xylem walls"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Trace water from soil to leaf.",
          "steps": [
            "Water enters root hair cells by osmosis.",
            "It passes into xylem.",
            "Transpiration pull draws water upwards."
          ]
        }
      ],
      "questions": [
        {
          "id": "plant-transport-s1-simple",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which tissue transports water?",
          "answer": "Xylem",
          "options": [
            "Xylem",
            "Phloem",
            "Epidermis only",
            "Palisade"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Xylem carries water and minerals."
          ],
          "explanation": "Xylem carries water and minerals."
        },
        {
          "id": "plant-transport-s1-intermediate",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why are xylem walls lignified?",
          "answer": "To strengthen vessels and resist collapse",
          "options": [
            "To strengthen vessels and resist collapse",
            "To store glucose as starch",
            "To perform fertilisation",
            "To absorb light"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Lignin supports vessels under tension."
          ],
          "explanation": "Lignin supports vessels under tension."
        },
        {
          "id": "plant-transport-s1-hard",
          "subtopicId": "s1",
          "kind": "choice",
          "level": "hard",
          "prompt": "What drives most water ascent in a tall plant?",
          "answer": "Transpiration pull and cohesion of water",
          "options": [
            "Transpiration pull and cohesion of water",
            "Heart-like pumping in roots",
            "Active transport of whole water columns",
            "Gravity alone"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Evaporation at leaves creates tension in continuous water columns."
          ],
          "explanation": "Evaporation at leaves creates tension in continuous water columns."
        }
      ]
    },
    {
      "id": "s2",
      "title": "Transpiration and stomata",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Transpiration is evaporation of water from leaf cells followed by diffusion of water vapour through stomata. Water molecules cohere, so loss from leaves creates a pulling force up the xylem.",
        "Wind and warmth often increase transpiration; high humidity reduces the gradient. Stomata close in dry conditions to reduce water loss but also restrict CO₂ entry."
      ],
      "terms": [
        {
          "term": "transpiration",
          "definition": "Loss of water vapour from aerial parts of a plant"
        },
        {
          "term": "guard cell",
          "definition": "Cell controlling opening of a stoma"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Explain a windy day.",
          "steps": [
            "Wind removes humid air near stomata.",
            "A steep water vapour gradient is maintained.",
            "Transpiration usually increases."
          ]
        }
      ],
      "questions": [
        {
          "id": "plant-transport-s2-simple",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "simple",
          "prompt": "Where does most transpiration occur?",
          "answer": "Stomata",
          "options": [
            "Stomata",
            "Roots",
            "Seeds",
            "Xylem walls alone"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Most water vapour exits through stomata."
          ],
          "explanation": "Most water vapour exits through stomata."
        },
        {
          "id": "plant-transport-s2-intermediate",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "How does high humidity affect transpiration?",
          "answer": "It usually decreases because the gradient is smaller",
          "options": [
            "It usually decreases because the gradient is smaller",
            "It always increases",
            "It makes stomata into roots",
            "It stops all osmosis"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "A smaller vapour gradient reduces diffusion."
          ],
          "explanation": "A smaller vapour gradient reduces diffusion."
        },
        {
          "id": "plant-transport-s2-hard",
          "subtopicId": "s2",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why can closing stomata reduce photosynthesis?",
          "answer": "Less CO₂ enters the leaf",
          "options": [
            "Less CO₂ enters the leaf",
            "Chloroplasts are destroyed immediately",
            "Glucose leaves through xylem",
            "The roots stop absorbing minerals permanently"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "CO₂ supply is reduced when stomata close."
          ],
          "explanation": "CO₂ supply is reduced when stomata close."
        }
      ]
    },
    {
      "id": "s3",
      "title": "Phloem and translocation",
      "learningGoals": [
        "Describe the structures or process using correct scientific vocabulary",
        "Apply the concept to an unfamiliar example"
      ],
      "explanation": [
        "Phloem transports dissolved sugars such as sucrose and other organic solutes from sources (production or storage) to sinks (growth or storage). Movement may occur in different directions in different sieve tubes.",
        "Sieve tube elements are living but have few organelles and are supported by companion cells. Translocation differs from the mainly upward water transport in xylem."
      ],
      "terms": [
        {
          "term": "translocation",
          "definition": "Transport of dissolved organic substances in phloem"
        },
        {
          "term": "source",
          "definition": "Region exporting sugars"
        },
        {
          "term": "sink",
          "definition": "Region importing or using sugars"
        }
      ],
      "formulas": [],
      "examples": [
        {
          "prompt": "Explain sugar delivery to a root.",
          "steps": [
            "Photosynthesising leaves produce sugars.",
            "Sucrose is loaded into phloem.",
            "It moves to roots for storage or respiration."
          ]
        }
      ],
      "questions": [
        {
          "id": "plant-transport-s3-simple",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "simple",
          "prompt": "Which tissue transports sucrose?",
          "answer": "Phloem",
          "options": [
            "Phloem",
            "Xylem",
            "Cuticle",
            "Stoma"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Phloem translocates dissolved sugars."
          ],
          "explanation": "Phloem translocates dissolved sugars."
        },
        {
          "id": "plant-transport-s3-intermediate",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "intermediate",
          "prompt": "Why can phloem transport in different directions?",
          "answer": "Different source–sink relationships exist",
          "options": [
            "Different source–sink relationships exist",
            "Gravity always pushes sugar down",
            "Phloem is made of dead hollow tubes",
            "Water cannot enter phloem"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Different sieve tubes serve different source–sink pairs."
          ],
          "explanation": "Different sieve tubes serve different source–sink pairs."
        },
        {
          "id": "plant-transport-s3-hard",
          "subtopicId": "s3",
          "kind": "choice",
          "level": "hard",
          "prompt": "Why might a developing fruit be a sink?",
          "answer": "It imports sugars for growth and storage",
          "options": [
            "It imports sugars for growth and storage",
            "It always exports more sugar than it makes",
            "It contains no cells",
            "It performs no respiration"
          ],
          "hint": "Identify the mechanism and rule out explanations that contradict it.",
          "solution": [
            "Developing fruits require imported organic nutrients."
          ],
          "explanation": "Developing fruits require imported organic nutrients."
        }
      ]
    }
  ]
};
