import {TestDifficulty} from "../interfaces/test/test-difficulty.enum";
import {GenerationStrategy} from "../interfaces/questions-pool/generation-strategy.enum";

export const DATE_FORMAT: string = 'dd.MM.YYYY HH:mm:ss';

export const DIFFICULTY_VALUES: string[] = [
    TestDifficulty.Easy, TestDifficulty.Medium, TestDifficulty.Hard
]

export const GENERATION_STRATEGIES_VALUES: string[] = [
    GenerationStrategy.Sequentially, GenerationStrategy.Randomly
]
