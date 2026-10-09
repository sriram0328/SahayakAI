
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Award, RefreshCw, Trophy, Users, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Question = {
  text: string;
  answer: number;
};

const generateQuestion = (): Question => {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const isAdd = Math.random() > 0.5;
  return {
    text: isAdd ? `${num1} + ${num2}` : `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`,
    answer: isAdd ? num1 + num2 : Math.max(num1, num2) - Math.min(num1, num2),
  };
};

export function TugOfWarGame() {
  const [position, setPosition] = useState(50);
  const [team1Question, setTeam1Question] = useState<Question | null>(null);
  const [team2Question, setTeam2Question] = useState<Question | null>(null);
  const [team1Input, setTeam1Input] = useState('');
  const [team2Input, setTeam2Input] = useState('');
  const [winner, setWinner] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTeam1Question(generateQuestion());
    setTeam2Question(generateQuestion());
  }, []);

  const handleTeam1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1Question || winner) return;
    if (parseInt(team1Input) === team1Question.answer) {
      setPosition((prev) => Math.max(0, prev - 10));
      setTeam1Question(generateQuestion());
      setTeam1Input('');
    } else {
      setTeam1Input('');
    }
  };

  const handleTeam2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team2Question || winner) return;
    if (parseInt(team2Input) === team2Question.answer) {
      setPosition((prev) => Math.min(100, prev + 10));
      setTeam2Question(generateQuestion());
      setTeam2Input('');
    } else {
      setTeam2Input('');
    }
  };

  useEffect(() => {
    if (position <= 0) setWinner(1);
    if (position >= 100) setWinner(2);
  }, [position]);

  const resetGame = () => {
    setPosition(50);
    setWinner(null);
    setTeam1Question(generateQuestion());
    setTeam2Question(generateQuestion());
    setTeam1Input('');
    setTeam2Input('');
  };

  if (!mounted) {
    return (
      <Card className="flex items-center justify-center p-20 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <Card className="bg-primary/5 overflow-hidden shadow-2xl border-t-8 border-primary relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-transparent to-red-500 opacity-50" />
        <CardHeader className="text-center bg-white/60 backdrop-blur-md border-b">
          <CardTitle className="text-4xl font-headline flex items-center justify-center gap-3 text-primary">
            <Trophy className="text-yellow-500 w-10 h-10" />
            Tug of War Math
          </CardTitle>
          <CardDescription className="text-base font-medium">Solve math problems to pull the rope! Team Blue vs Team Red!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-12 py-16">
          <div className="relative h-64 flex flex-col items-center justify-center">
            <div className="flex justify-between w-full px-4 sm:px-12 mb-8 z-10 relative">
              <div className="flex flex-col items-center gap-2">
                 <div className={cn(
                        "p-6 rounded-2xl shadow-xl border-4 transition-all duration-500 flex items-center justify-center",
                        winner === 1 ? 'bg-yellow-400 scale-125 border-yellow-200 rotate-12' : 'bg-blue-600 border-blue-400 text-white'
                    )}>
                    <Users className="w-10 h-10 sm:w-16 sm:h-16" />
                </div>
                <span className="text-lg font-bold text-blue-700 uppercase tracking-widest">Team Blue</span>
              </div>
              
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-6 bg-yellow-900/20 rounded-full shadow-inner -z-10 border border-black/5">
                 <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.05)_10px,rgba(0,0,0,0.05)_20px)] rounded-full" />
                 <div 
                    className="absolute top-1/2 w-10 h-14 bg-red-600 border-4 border-white rounded-md shadow-2xl transition-all duration-700 ease-out z-20"
                    style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
                 >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white/30" />
                 </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={cn(
                        "p-6 rounded-2xl shadow-xl border-4 transition-all duration-500 flex items-center justify-center",
                        winner === 2 ? 'bg-yellow-400 scale-125 border-yellow-200 -rotate-12' : 'bg-red-600 border-red-400 text-white'
                    )}>
                    <Users className="w-10 h-10 sm:w-16 sm:h-16" />
                </div>
                <span className="text-lg font-bold text-red-700 uppercase tracking-widest">Team Red</span>
              </div>
            </div>

            <div className="w-full max-w-4xl h-10 bg-muted rounded-full relative overflow-hidden border-4 border-white shadow-lg mt-8">
              <div className="absolute top-0 bottom-0 w-2 bg-white/80 z-20 shadow-sm" style={{ left: '50%', transform: 'translateX(-50%)' }} />
              <div className="absolute inset-0 flex">
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 h-full transition-all duration-700 ease-out" style={{ width: `${position}%` }} />
                <div className="bg-gradient-to-l from-red-700 to-red-500 h-full transition-all duration-700 ease-out" style={{ width: `${100 - position}%` }} />
              </div>
            </div>
          </div>

          {winner && (
            <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-700">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-12 rounded-[2.5rem] text-center shadow-2xl border-4 border-yellow-100">
                <Award className="w-24 h-24 mx-auto mb-6 animate-bounce text-yellow-100" />
                <h2 className="text-4xl font-black font-headline uppercase tracking-widest">
                  VICTORY FOR<br/>
                  <span className={winner === 1 ? 'text-blue-100' : 'text-red-100'}>
                    TEAM {winner === 1 ? 'BLUE' : 'RED'}
                  </span>
                </h2>
              </div>
              <Button onClick={resetGame} size="lg" className="h-16 px-12 text-xl font-bold rounded-full shadow-xl hover:scale-105 transition-transform bg-primary">
                <RefreshCw className="mr-3 h-6 w-6" /> Play Another Round
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {!winner && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="border-4 border-blue-500 bg-blue-50/30 shadow-2xl">
            <CardHeader className="bg-blue-600 text-white py-6">
              <CardTitle className="text-center font-headline text-2xl">Team Blue</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 px-8 pb-8 space-y-6">
              {team1Question && (
                <form onSubmit={handleTeam1Submit} className="space-y-6">
                  <div className="text-center py-12 px-6 bg-white rounded-3xl border-4 border-blue-200">
                    <p className="text-6xl font-black text-blue-900 tracking-tighter">{team1Question.text}</p>
                  </div>
                  <Input
                    type="number"
                    placeholder="?"
                    value={team1Input}
                    onChange={(e) => setTeam1Input(e.target.value)}
                    className="text-center text-5xl h-24 bg-white border-blue-300 rounded-2xl"
                    autoFocus
                  />
                  <Button type="submit" className="w-full h-20 text-2xl font-black bg-blue-600 hover:bg-blue-700 rounded-2xl">PULL!</Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="border-4 border-red-500 bg-red-50/30 shadow-2xl">
            <CardHeader className="bg-red-600 text-white py-6">
              <CardTitle className="text-center font-headline text-2xl">Team Red</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 px-8 pb-8 space-y-6">
              {team2Question && (
                <form onSubmit={handleTeam2Submit} className="space-y-6">
                  <div className="text-center py-12 px-6 bg-white rounded-3xl border-4 border-red-200">
                    <p className="text-6xl font-black text-red-900 tracking-tighter">{team2Question.text}</p>
                  </div>
                  <Input
                    type="number"
                    placeholder="?"
                    value={team2Input}
                    onChange={(e) => setTeam2Input(e.target.value)}
                    className="text-center text-5xl h-24 bg-white border-red-300 rounded-2xl"
                  />
                  <Button type="submit" className="w-full h-20 text-2xl font-black bg-red-600 hover:bg-red-700 rounded-2xl">PULL!</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
