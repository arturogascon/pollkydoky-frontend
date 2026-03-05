import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useVote } from "../../hooks/useVote";
import { useVoteRealTime } from "../../hooks/useVoteRealTime";
import { getIsPollVoted } from "../../utils/voteStorage";
import { useGetPoll } from "../../hooks/usePoll";
import Button from "../../components/atoms/Button";
import ProgressBar from "../../components/atoms/ProgressBar";

const PollPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const showResults =
    hasSubmitted ||
    searchParams.get("results") === "true" ||
    getIsPollVoted(id!);

  const { data: poll, isLoading, error: queryError } = useGetPoll(id!);

  const optionsWithPercentages = useMemo(() => {
    if (!poll) return [];

    return poll.options
      .toSorted((a, b) => b.votes - a.votes)
      .map((option) => ({
        ...option,
        percentage: poll.totalVotes
          ? Math.round((option.votes / poll.totalVotes) * 100)
          : 0,
      }));
  }, [poll]);

  const { mutate: submitVote, isPending, error: mutateError } = useVote(id!);

  const hasVoted = mutateError?.response?.status === 403;

  const handleVote = () => {
    if (!selectedOption) return;
    setHasSubmitted(true);
    submitVote(selectedOption);
  };

  useVoteRealTime(id!);

  if (isLoading)
    return (
      <div>
        <p>Cargando encuesta</p>
      </div>
    );

  if (!poll || queryError)
    return (
      <div>
        <p>Encuesta no encontrada</p>
      </div>
    );

  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl flex-1 py-4">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        <h1 className="text-center text-balance text-xl font-bold text-foreground md:text-3xl mb-2">
          {poll?.question}
        </h1>
        {hasVoted && (
          <p className="text-slate-500 mb-4 font-medium">
            * Voto previo registrado
          </p>
        )}
        <div className="mt-8">
          {showResults || hasVoted ? (
            <div className="flex flex-col gap-y-4 items-start">
              {optionsWithPercentages.map((option, idx) => {
                const votedPerecentage =
                  poll.totalVotes &&
                  Math.round((option.votes / poll.totalVotes) * 100);
                const color = OPTION_COLORS[idx % OPTION_COLORS.length];

                return (
                  <div key={option._id} className="flex flex-col gap-1 w-full">
                    <div className="flex flex-row justify-between items-center text-xs">
                      <p className=" font-medium text-left text-ellipsis">
                        {option.text}
                      </p>{" "}
                      <p className="text-primary font-mono">{`${votedPerecentage}%`}</p>
                    </div>

                    <ProgressBar
                      value={votedPerecentage ? votedPerecentage : 0}
                      className="mt-1.5"
                      bgColor={color.fill}
                      bgOpacity={color.bg}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <form className="flex flex-col justify-start gap-y-3">
              {poll?.options.map((option, idx) => {
                const isSelected = selectedOption === option._id;
                const color = OPTION_COLORS[idx % OPTION_COLORS.length];
                return (
                  <button
                    key={option._id}
                    className={`group relative overflow-hidden rounded-2xl border font-medium px-5 py-4 text-left transition-all ${
                      isSelected
                        ? `border-2 ${color.border} ${color.bg} ring-2 ${color.ring}`
                        : "border-border bg-card hover:border-primary/20 hover:bg-secondary/50"
                    }`}
                    type="button"
                    onClick={() => setSelectedOption(option._id)}
                  >
                    {option.text}
                  </button>
                );
              })}
              {!hasVoted && !showResults && (
                <div className="mt-6 text-center">
                  <Button
                    disabled={!selectedOption || isPending}
                    className="w-full sm:w-auto"
                    icon="hand_line"
                    onClick={handleVote}
                  >
                    Votar
                  </Button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const OPTION_COLORS = [
  {
    fill: "bg-pink",
    bg: "bg-pink/15",
    border: "border-pink/40",
    text: "text-pink",
    ring: "ring-pink/20",
  },
  {
    fill: "bg-cyan",
    bg: "bg-cyan/15",
    border: "border-cyan/40",
    text: "text-cyan",
    ring: "ring-cyan/20",
  },
  {
    fill: "bg-yellow",
    bg: "bg-yellow/15",
    border: "border-yellow/40",
    text: "text-yellow",
    ring: "ring-yellow/20",
  },

  {
    fill: "bg-purple",
    bg: "bg-purple/15",
    border: "border-purple/40",
    text: "text-purple",
    ring: "ring-purple/20",
  },
  {
    fill: "bg-green",
    bg: "bg-green/15",
    border: "border-green/40",
    text: "text-green",
    ring: "ring-green/20",
  },
];

export default PollPage;
