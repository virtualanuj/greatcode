// src/types/curriculum.types.ts

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type ComplexityClass =
  | 'O(1)'
  | 'O(log n)'
  | 'O(n)'
  | 'O(n log n)'
  | 'O(n^2)'
  | 'O(2^n)'
  | 'O(k)'
  | 'O(h)'
  | 'O(V + E)'
  | 'O(V)'
  | 'O(m * n)'
  | 'O(N log k)'
  | 'O(n!)'
  | 'Amortized O(1)'
  | 'O(1) per operation'
  | string;

export interface TestCase {
  id: string;
  input: Record<string, any>;
  expectedOutput: any;
  isHidden?: boolean;
  explanation?: string;
}

export interface HintLadderItem {
  level: 1 | 2 | 3 | 4;
  title: string;
  content: string;
}

export interface ProblemDefinition {
  id: string;
  patternId: string;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  timeComplexity: ComplexityClass;
  spaceComplexity: ComplexityClass;
  descriptionMarkdown: string;
  constraints: string[];
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hints: HintLadderItem[];
}

export interface PatternDefinition {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  detailedConcept: string;
  iconName: string;
  timeComplexityTypical: string;
  spaceComplexityTypical: string;
  keyInsights: string[];
  visualizerDefaultCode: string;
  visualizerDefaultInputs: Record<string, any>;
  visualizerInputSchema: {
    fields: {
      key: string;
      label: string;
      type: 'array_number' | 'number' | 'string' | 'matrix_number';
      placeholder: string;
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
      defaultValue: any;
    }[];
  };
}
