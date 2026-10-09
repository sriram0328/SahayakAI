
"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, RefreshCw, XCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2, Star, X, ArrowRightCircle, Shield, Brain, Rocket, Award, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { GeneratingLoader } from "@/components/ui/generating-loader";

// --- Types ---
type Position = { row: number; col: number };
type CommandType = 'up' | 'down' | 'left' | 'right';
type Command = { type: CommandType; id: number };
type Level = {
  grid: number[][];
  start: Position;
  goal: Position;
  instructions: string;
  availableCommands: CommandType[];
};
type Difficulty = 'easy' | 'medium' | 'hard';

// --- Level Data ---
const allLevels: Record<Difficulty, Level[]> = {
  easy: [
    { grid: [[0, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 0, col: 2 }, instructions: "Get to the star!", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0], [0], [2]], start: { row: 0, col: 0 }, goal: { row: 2, col: 0 }, instructions: "Head straight for the goal.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 0, col: 4 }, instructions: "A longer path. Can you make it?", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[2, 0, 0, 0]], start: { row: 0, col: 3 }, goal: { row: 0, col: 0 }, instructions: "Go left to reach your goal!", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0], [2, 1, 0], [0, 0, 0]], start: { row: 0, col: 0 }, goal: { row: 1, col: 0 }, instructions: "Go down and then left.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 2], [0, 1], [0, 0]], start: { row: 2, col: 0 }, goal: { row: 0, col: 1 }, instructions: "Go up and then right.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0], [0, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 1, col: 2 }, instructions: "A simple L-shape path.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 0, 0], [0, 2, 1, 1, 1], [0, 0, 0, 0, 0]], start: {row: 0, col: 0}, goal: {row: 1, col: 1}, instructions: "A simple L-shape path.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 1], [0, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 1, col: 2 }, instructions: "Avoid the obstacle.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 0, col: 3 }, instructions: "A quick hop over the gap.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 1, 0], [0, 1, 0], [2, 0, 0]], start: { row: 0, col: 2 }, goal: { row: 2, col: 0 }, instructions: "Down and to the left.", availableCommands: ['up', 'down', 'left', 'right'] },
  ],
  medium: [
    { grid: [[0, 1, 0], [0, 0, 0], [1, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 2, col: 2 }, instructions: "Weave through the path to the goal.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 1], [1, 1, 0, 0], [2, 0, 0, 0]], start: { row: 0, col: 3 }, goal: { row: 2, col: 0 }, instructions: "Find the winding road.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 1, 2], [0, 1, 0], [0, 0, 0]], start: { row: 2, col: 0 }, goal: { row: 0, col: 2 }, instructions: "A classic snake pattern.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 1, 0, 0], [0, 0, 0, 0], [0, 1, 0, 1], [0, 1, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 3, col: 3 }, instructions: "A tricky path with multiple dead ends.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 0, 0], [1, 1, 1, 1, 0], [0, 0, 0, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 2, col: 4 }, instructions: "Go all the way right, then down, then right again!", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 1, 0, 1, 0], [0, 1, 0, 1, 0], [0, 0, 0, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 2, col: 4 }, instructions: "It looks like a maze, but there is a way!", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 1, 0, 0], [1, 0, 0, 0, 1], [0, 0, 2, 0, 0]], start: { row: 0, col: 0 }, goal: { row: 2, col: 2 }, instructions: "Navigate to the heart of the grid.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 1], [0, 1, 0], [2, 0, 0]], start: { row: 0, col: 0 }, goal: { row: 2, col: 0 }, instructions: "A staircase to success.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 1, 2], [0, 1, 0, 0, 0]], start: { row: 1, col: 0 }, goal: { row: 0, col: 4 }, instructions: "Go around the long wall.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[2, 1, 0, 0, 0], [0, 0, 0, 1, 0]], start: { row: 1, col: 4 }, goal: { row: 0, col: 0 }, instructions: "A winding path from right to left.", availableCommands: ['up', 'down', 'left', 'right'] },
  ],
  hard: [
    { grid: [[0, 0, 1, 0, 0], [1, 0, 0, 0, 1], [0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [0, 1, 2, 1, 0]], start: { row: 0, col: 1 }, goal: { row: 4, col: 2 }, instructions: "The path is narrow. Plan your moves!", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 1, 0], [0, 1, 0, 1, 0], [0, 1, 0, 0, 0], [0, 1, 1, 0, 1], [0, 0, 0, 0, 2]], start: { row: 0, col: 0 }, goal: { row: 4, col: 4 }, instructions: "A real challenge! Think carefully.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 0, 0, 1, 0], [2, 1, 0, 1, 0], [0, 0, 0, 0, 0]], start: { row: 4, col: 4 }, goal: { row: 3, col: 0 }, instructions: "Work your way backwards to the goal.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 0], [0, 1, 0, 0, 0, 0], [0, 1, 0, 2, 1, 0], [0, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0]], start: { row: 0, col: 0 }, goal: { row: 3, col: 3 }, instructions: "Find the opening and get to the center.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 0, 2, 0], [1, 1, 1, 1]], start: { row: 0, col: 0 }, goal: { row: 2, col: 2 }, instructions: "Find the safe spot in the middle.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 0], [2, 0, 1, 0]], start: { row: 0, col: 0 }, goal: { row: 3, col: 0 }, instructions: "Diagonal thinking might help here.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 0, 0, 1, 2], [1, 1, 0, 1, 0], [0, 0, 0, 0, 0]], start: { row: 2, col: 0 }, goal: { row: 0, col: 4 }, instructions: "Don't get trapped!", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 1, 0, 1, 1], [0, 0, 0, 1, 2]], start: { row: 1, col: 0 }, goal: { row: 3, col: 4 }, instructions: "The final challenge! Good luck.", availableCommands: ['up', 'down', 'left', 'right'] },
    { grid: [[0, 1, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 0], [2, 0, 0, 0, 0]], start: { row: 1, col: 1 }, goal: { row: 3, col: 0 }, instructions: 'Find the opening.', availableCommands: ['up', 'down', 'left', 'right']},
    { grid: [[0, 0, 0, 0, 1, 2], [1, 1, 1, 0, 1, 0], [1, 0, 0, 0, 1, 0], [1, 0, 1, 1, 1, 0], [1, 0, 0, 0, 0, 0]], start: {row: 4, col: 4}, goal: {row: 0, col: 5}, instructions: "A long and winding road.", availableCommands: ['up', 'down', 'left', 'right']}
  ],
};

const commandDetails: { [key in CommandType]: { icon: React.ElementType, label: string, key: string } } = {
    up: { icon: ArrowUp, label: "Move Up", key: "ArrowUp" },
    down: { icon: ArrowDown, label: "Move Down", key: "ArrowDown" },
    left: { icon: ArrowLeft, label: "Move Left", key: "ArrowLeft" },
    right: { icon: ArrowRight, label: "Move Right", key: "ArrowRight" },
};

// --- Components ---
const GridDisplay = ({ grid, playerPos }: { grid: number[][], playerPos: Position }) => {
  return (
    <div className="bg-muted p-2 sm:p-4 rounded-lg border aspect-auto max-w-sm mx-auto">
      <div className="grid gap-1">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((cell, colIndex) => {
              const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
              const cellType = cell === 1 ? 'obstacle' : cell === 2 ? 'goal' : 'empty';
              
              return (
                <div key={colIndex} className={cn("w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full transition-all duration-300 flex items-center justify-center", {
                  'bg-blue-200 dark:bg-blue-900/50': cellType === 'empty',
                  'bg-background': cellType === 'obstacle',
                  'bg-yellow-200 dark:bg-yellow-800/60': cellType === 'goal',
                })}>
                  {cellType === 'goal' && <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-800 dark:text-yellow-200" />}
                  {cellType === 'obstacle' && <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />}
                  {isPlayer && (
                     <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-orange-400 rounded-full border-2 border-orange-600 dark:border-orange-200 shadow-lg animate-pulse"/>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Main Game Page ---
export default function LogicGridPage() {
  const { toast } = useToast();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [solution, setSolution] = useState<Command[]>([]);
  const [playerPos, setPlayerPos] = useState<Position | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadNewLevel = useCallback((difficulty: Difficulty) => {
    const levels = allLevels[difficulty];
    let newLevelIndex;
    do {
      newLevelIndex = Math.floor(Math.random() * levels.length);
    } while (levels.length > 1 && newLevelIndex === currentLevelIndex);

    const newLevel = levels[newLevelIndex];
    setCurrentLevelIndex(newLevelIndex);
    setCurrentLevel(newLevel);
    setPlayerPos(newLevel.start);
    setSolution([]);
    setIsSuccess(false);
    setError(null);
  }, [currentLevelIndex]);
  
  const addCommand = useCallback((type: Command['type']) => {
    if (isExecuting || isSuccess) return;
    setSolution(prev => [...prev, { type, id: Date.now() + Math.random() }]);
  }, [isExecuting, isSuccess]);

  useEffect(() => {
    if (selectedDifficulty && isClient && !currentLevel) {
        loadNewLevel(selectedDifficulty);
    }
  }, [selectedDifficulty, isClient, currentLevel, loadNewLevel]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isExecuting || isSuccess || !currentLevel) return;

        const command = Object.values(commandDetails).find(details => details.key === e.key);
        if (command && currentLevel.availableCommands.includes(command.label.split(' ')[1].toLowerCase() as CommandType)) {
            e.preventDefault();
            addCommand(command.label.split(' ')[1].toLowerCase() as CommandType);
        } else if (e.key === 'Enter' && solution.length > 0) {
            e.preventDefault();
            executeCommands();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExecuting, isSuccess, currentLevel, solution.length, addCommand]);


  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentLevel(null); // Force level reload
  }

  const resetLevel = useCallback(() => {
    if (!currentLevel) return;
    setIsExecuting(false);
    setIsSuccess(false);
    setError(null);
    setPlayerPos(currentLevel.start);
  }, [currentLevel]);

  const executeCommands = async () => {
      if (!currentLevel) return;
      setIsExecuting(true);
      setPlayerPos(currentLevel.start);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let currentPos = { ...currentLevel.start };

      for (const command of solution) {
          await new Promise(resolve => setTimeout(resolve, 300));
          let nextPos = { ...currentPos };

          switch (command.type) {
              case 'up': nextPos.row--; break;
              case 'down': nextPos.row++; break;
              case 'left': nextPos.col--; break;
              case 'right': nextPos.col++; break;
          }

          if (
              nextPos.row < 0 || nextPos.row >= currentLevel.grid.length ||
              nextPos.col < 0 || nextPos.col >= currentLevel.grid[0].length ||
              currentLevel.grid[nextPos.row][nextPos.col] === 1
          ) {
              setError("You went off-grid or hit an obstacle!");
              setPlayerPos(currentPos);
              setIsExecuting(false);
              return;
          }
          
          currentPos = nextPos;
          setPlayerPos(currentPos);
      }

      if (currentPos.row === currentLevel.goal.row && currentPos.col === currentLevel.goal.col) {
          setIsSuccess(true);
          toast({ title: "Level Complete!", description: "Great job!" });
      } else {
          setError("You didn't reach the goal. Check your commands!");
      }

      setIsExecuting(false);
  };

  if (!isClient) {
      return <GeneratingLoader>Loading Game...</GeneratingLoader>
  }

  if (!selectedDifficulty) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Select a Difficulty</CardTitle>
                <CardDescription>Choose a challenge level to start the game.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => handleSelectDifficulty('easy')}>
                    <Shield className="w-8 h-8 text-green-500" />
                    <span className="text-lg">Easy</span>
                </Button>
                 <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => handleSelectDifficulty('medium')}>
                    <Brain className="w-8 h-8 text-blue-500" />
                    <span className="text-lg">Medium</span>
                </Button>
                 <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => handleSelectDifficulty('hard')}>
                    <Rocket className="w-8 h-8 text-red-500" />
                    <span className="text-lg">Hard</span>
                </Button>
            </CardContent>
        </Card>
    )
  }
  
  if (!currentLevel || !playerPos) {
      return <GeneratingLoader>Loading Level...</GeneratingLoader>
  }


  return (
    <Card>
      <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline">Logic Grid Challenge</CardTitle>
              <CardDescription>{currentLevel.instructions}</CardDescription>
            </div>
             <Button onClick={() => setSelectedDifficulty(null)} variant="outline">
                Change Difficulty
            </Button>
          </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
        {(isSuccess || error) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg p-4 z-10">
                {isSuccess ? (
                    <div className="text-center flex flex-col items-center gap-4 p-6 bg-green-50 dark:bg-green-900/50 rounded-xl border-2 border-green-500">
                        <Award className="w-16 h-16 text-green-600"/>
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">You Won!</h3>
                        <Button onClick={() => loadNewLevel(selectedDifficulty)} variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                            Next Level <ArrowRightCircle className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                ) : (
                    <div className="text-center flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-900/50 rounded-xl border-2 border-red-500">
                        <XCircle className="w-16 h-16 text-red-600" />
                        <h3 className="text-2xl font-bold text-red-800 dark:text-red-200">You Lost</h3>
                        <Button onClick={resetLevel} variant="outline">
                            Try Again
                        </Button>
                    </div>
                )}
            </div>
        )}
        
        <div className="flex items-center justify-center">
            <GridDisplay grid={currentLevel.grid} playerPos={playerPos} />
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <p className="text-sm font-medium">Available Commands</p>
                <div className="flex gap-2 flex-wrap">
                    {currentLevel.availableCommands.map((cmdType) => {
                        const cmdDetails = commandDetails[cmdType];
                        return (
                            <Button key={cmdType} variant="outline" onClick={() => addCommand(cmdType)} disabled={isExecuting || isSuccess}>
                                <cmdDetails.icon className="mr-2"/> {cmdDetails.label}
                            </Button>
                        )
                    })}
                </div>
                <p className="text-xs text-muted-foreground">Tip: Use arrow keys (↑ ↓ ← →) and Enter to play faster!</p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Your Command Sequence</p>
                      <Button onClick={() => setSolution([])} variant="ghost" size="sm" disabled={isExecuting || isSuccess || solution.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4"/> Clear
                      </Button>
                </div>
                <div className="border rounded-lg bg-muted min-h-[120px] p-2 space-y-1">
                    {solution.length > 0 ? (
                        solution.map((cmd) => {
                            const cmdDetails = commandDetails[cmd.type];
                            return (
                                <div key={cmd.id} className="flex items-center gap-2 bg-background p-2 rounded-md shadow-sm text-sm">
                                    <cmdDetails.icon />
                                    <span>{cmdDetails.label}</span>
                                </div>
                            )
                        })
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Your commands will appear here.
                        </div>
                    )}
                </div>
            </div>

              <div className="flex gap-2">
                  <Button onClick={executeCommands} disabled={isExecuting || isSuccess || solution.length === 0} className="w-full">
                    <Play className="mr-2 h-4 w-4"/> Run Sequence
                  </Button>
                  <Button onClick={resetLevel} variant="outline" disabled={isExecuting}>
                    <RefreshCw className="mr-2 h-4 w-4"/> Reset
                  </Button>
              </div>
        </div>
      </CardContent>
    </Card>
  );
}

    

    