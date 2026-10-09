"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BrainCircuit, Calculator, Puzzle as PuzzleIcon, Rocket, Shield, Star, RefreshCw, Award, ArrowRight, Code } from 'lucide-react';
import { QuizGame } from '@/components/games/quiz-game';
import type { Question } from '@/components/games/quiz-game';
import { PuzzleGame } from '@/components/games/puzzle-game';
import type { Puzzle } from '@/components/games/puzzle-game';
import { MemoryGame } from '@/components/games/memory-game';
import type { CardItem } from '@/components/games/memory-game';
import { GeneratingLoader } from '@/components/ui/generating-loader';
import Link from 'next/link';

type GameType = 'quiz' | 'puzzle' | 'memory' | 'logic' | 'tug-of-war';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const getDifficulty = (level: number): Difficulty => {
  if (level < 4) return 'beginner';
  if (level < 8) return 'intermediate';
  return 'advanced';
};

const getLevelBadge = (level: number) => {
    const difficulty = getDifficulty(level);
    switch(difficulty) {
        case 'beginner': return <Badge variant="secondary"><Shield className="mr-1 h-3 w-3"/>{difficulty}</Badge>
        case 'intermediate': return <Badge><Star className="mr-1 h-3 w-3"/>{difficulty}</Badge>
        case 'advanced': return <Badge variant="destructive"><Rocket className="mr-1 h-3 w-3"/>{difficulty}</Badge>
    }
}

const generateQuizQuestions = (level: number): Question[] => {
    return Array.from({ length: 5 }, () => {
        const operators = ['+', '-', '*', '/'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let num1, num2, questionText, correctAnswer;
        const maxNum = level * 5;

        switch (operator) {
            case '+':
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                correctAnswer = num1 + num2;
                questionText = `What is ${num1} + ${num2}?`;
                break;
            case '-':
                const a = Math.floor(Math.random() * maxNum) + 1;
                const b = Math.floor(Math.random() * maxNum) + 1;
                num1 = Math.max(a, b);
                num2 = Math.min(a, b);
                correctAnswer = num1 - num2;
                questionText = `What is ${num1} - ${num2}?`;
                break;
            case '*':
                num1 = Math.floor(Math.random() * (level + 4)) + 1;
                num2 = Math.floor(Math.random() * 9) + 1;
                correctAnswer = num1 * num2;
                questionText = `What is ${num1} × ${num2}?`;
                break;
            case '/':
                const result = Math.floor(Math.random() * (level + 2)) + 1;
                num2 = Math.floor(Math.random() * 8) + 2;
                num1 = result * num2;
                correctAnswer = result;
                questionText = `What is ${num1} ÷ ${num2}?`;
                break;
            default:
                num1 = 1; num2 = 1; correctAnswer = 2; questionText = "1+1?";
        }
        
        const options = new Set<number>();
        options.add(correctAnswer);
        while(options.size < 4) {
            const randomOption = correctAnswer + (Math.floor(Math.random() * 10) - 5);
            if (randomOption >= 0 && randomOption !== correctAnswer) {
                 options.add(randomOption);
            }
        }

        return {
            type: 'math',
            questionText: questionText,
            options: Array.from(options).sort(() => Math.random() - 0.5),
            correctAnswer: correctAnswer,
        };
    });
};

const generatePuzzles = (level: number): Puzzle[] => {
    const allWords = ['cat', 'dog', 'sun', 'run', 'cup', 'apple', 'house', 'water', 'earth', 'train', 'banana', 'orange', 'purple', 'window', 'teacher'];
    const wordSet = level < 3 ? allWords.slice(0, 5) : level < 6 ? allWords.slice(5, 10) : allWords.slice(10, 15);
    const selectedWords = wordSet.sort(() => 0.5 - Math.random()).slice(0, 5);
    return selectedWords.map(word => ({ word: word, hint: `A ${word.length}-letter word.` }));
};

const generateMemoryItems = (level: number): CardItem[] => {
    const icons = ['dog', 'cat', 'tree', 'sun', 'star', 'moon', 'car', 'bus', 'house', 'boat', 'fish', 'bird'];
    const numPairs = Math.min(Math.max(level + 1, 3), 8);
    const selectedIcons = icons.slice(0, numPairs);
    const items = [...selectedIcons, ...selectedIcons].sort(() => Math.random() - 0.5);
    return items.map((icon, index) => ({ id: `${icon}-${index}`, type: icon }));
};

const gameOptions = [
    { type: 'quiz' as GameType, title: 'Math Quiz', description: 'Solve quick math problems.', icon: Calculator },
    { type: 'puzzle' as GameType, title: 'Word Scramble', description: 'Unscramble letters.', icon: PuzzleIcon },
    { type: 'memory' as GameType, title: 'Memory Match', description: 'Find matching pairs.', icon: BrainCircuit },
    { type: 'tug-of-war' as GameType, title: 'Tug of War', description: 'Two-player math pull.', icon: Award },
    { type: 'logic' as GameType, title: 'Logic Grid', description: 'Solve with code.', icon: Code },
]

export default function GamifiedLearningPage() {
    const [activeGame, setActiveGame] = useState<GameType | null>(null);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gameKey, setGameKey] = useState(0);
    const [isGameCompleted, setIsGameCompleted] = useState(false);
    const [lastGameScore, setLastGameScore] = useState(0);
    const [isClient, setIsClient] = useState(false);

    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [memoryItems, setMemoryItems] = useState<CardItem[]>([]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            setQuizQuestions(generateQuizQuestions(level));
            setPuzzles(generatePuzzles(level));
            setMemoryItems(generateMemoryItems(level));
            setGameKey(prev => prev + 1);
        }
    }, [level, isClient]);

    const handleGameComplete = useCallback((gameScore: number) => {
        setScore(prev => prev + gameScore);
        setLastGameScore(gameScore);
        setIsGameCompleted(true);
    }, []);

    const handleSelectGame = (gameType: GameType) => {
        if (gameType === 'logic' || gameType === 'tug-of-war') return;
        setLevel(1);
        setScore(0);
        setIsGameCompleted(false);
        setActiveGame(gameType);
    };

    const handlePlayAgain = () => {
        if (isClient) {
            setQuizQuestions(generateQuizQuestions(level));
            setPuzzles(generatePuzzles(level));
            setMemoryItems(generateMemoryItems(level));
            setGameKey(prev => prev + 1);
        }
        setIsGameCompleted(false);
    };

    const handleNextLevel = () => {
        setLevel(prev => prev + 1);
        setIsGameCompleted(false);
    };

    if (!isClient) return <GeneratingLoader>Preparing arcade...</GeneratingLoader>;

    if (activeGame) {
        return (
            <div className="flex flex-col gap-6">
                 <Card>
                    <CardHeader className="p-4 flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="font-headline">{gameOptions.find(g => g.type === activeGame)?.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm pt-2">
                                <span className="font-semibold">{score} Points</span>
                                <span className="text-muted-foreground">Lvl {level}</span>
                                {getLevelBadge(level)}
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => setActiveGame(null)} size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4"/> Back
                        </Button>
                    </CardHeader>
                </Card>
                <div className="w-full">
                    {isGameCompleted ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-8 h-8 text-yellow-500" />
                                    Session Complete!
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>You earned <strong>{lastGameScore}</strong> points.</p>
                                <p>Total: <strong>{score}</strong></p>
                            </CardContent>
                            <CardFooter className="gap-2">
                                <Button variant="secondary" onClick={handlePlayAgain}>Replay</Button>
                                <Button onClick={handleNextLevel}>Next Level</Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        activeGame === 'quiz' ? <QuizGame key={gameKey} questions={quizQuestions} onGameComplete={handleGameComplete} /> :
                        activeGame === 'puzzle' ? <PuzzleGame key={gameKey} puzzles={puzzles} onGameComplete={handleGameComplete} /> :
                        activeGame === 'memory' ? <MemoryGame key={gameKey} items={memoryItems} onGameComplete={handleGameComplete} /> : null
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameOptions.map((game) => (
                <Card key={game.type} className="flex flex-col">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="p-3 border rounded-lg bg-primary/10">
                            <game.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-lg">{game.title}</CardTitle>
                            <CardDescription>{game.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter className="mt-auto flex justify-end">
                        <Button asChild size="sm">
                            <Link href={game.type === 'logic' ? '/logic-grid' : game.type === 'tug-of-war' ? '/tug-of-war' : '#' } onClick={() => handleSelectGame(game.type)}>Play</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
