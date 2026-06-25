import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import type { Poll } from "../../types";
import Button from "../../components/atoms/Button";
import ProgressBar from "../../components/atoms/ProgressBar";
import { useDeletePoll } from "../../hooks/usePoll";
import { getPolls } from "../../api/polls";
import { useState } from "react";

const Dashboard = () => {
  const {
    data: polls = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["polls"],
    queryFn: getPolls,
  });
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);

  const navigate = useNavigate();

  const { mutate: deletePoll } = useDeletePoll();

  const handleEditButton = (pollId: string) => {
    navigate(`/poll/${pollId}/edit`);
  };

  const handleResultsButton = (pollId: string) => {
    navigate(`/poll/${pollId}?results=true`);
  };

  const handleDeletePoll = () => {
    if (!pollToDelete) return;
    deletePoll(pollToDelete);
    setPollToDelete(null);
  };

  if (isLoading)
    return (
      <div>
        <p>Cargando encuestas</p>
      </div>
    );

  if (error || !polls)
    return (
      <div>
        <p>Error al cargar encuestas</p>
      </div>
    );

  const pollsArray = Array.isArray(polls) ? polls : [];

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl mb-1">
            {polls.length > 0 ? "Tus encuestas" : "No tienes encuestas"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Administra y rastrea tus encuestas en un solo lugar
          </p>
        </div>
        <Button icon="add_line" onClick={() => navigate("/create")}>
          Crear encuesta
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {(pollsArray as Poll[])?.map((poll: Poll) => {
          const isVotedPoll = poll.totalVotes > 0;
          const mostVotedOption = poll.options.reduce(
            (max, option) => (option.votes > max.votes ? option : max),
            poll.options[0],
          );
          return (
            <div
              key={poll._id}
              className="rounded-2xl border border-border card p-5 transition-shadow hover:shadow-sm md:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-row gap-2 items-center">
                    <h3 className="text-base font-semibold text-foreground md:text-lg">
                      <Link
                        to={`/polls/${poll._id}/share`}
                        className="hover:text-primary transition-colors"
                      >
                        <span>{poll.question}</span>
                      </Link>
                    </h3>
                    {!isVotedPoll && (
                      <button
                        className="text-slate-400 hover:text-slate-500 cursor-pointer"
                        title="Editar"
                        onClick={() => handleEditButton(poll._id)}
                        disabled={isVotedPoll}
                      >
                        <i className="mgc_pencil_fill "></i>
                      </button>
                    )}
                  </div>
                  <div className="mt-3 max-w-sm h-8">
                    {poll.totalVotes > 0 ? (
                      <div className="flex flex-col gap-1">
                        {" "}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Liderando:{" "}
                            <span className="font-medium text-foreground">
                              {mostVotedOption.text}
                            </span>
                          </span>
                          <span className="font-mono font-medium text-primary">
                            {(
                              (mostVotedOption.votes / poll.totalVotes) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <ProgressBar
                          value={
                            (mostVotedOption.votes / poll.totalVotes) * 100
                          }
                          className="mt-1.5"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay votos aún
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col justify-between">
                  <div className="text-center">
                    <p className="font-mono text-lg font-bold text-foreground">
                      {poll.totalVotes}
                    </p>
                    <p className="text-xs text-muted-foreground">{`voto${poll.totalVotes !== 1 ? "s" : ""}`}</p>
                  </div>

                  <div className="flex flex-column gap-2">
                    <button
                      className="text-slate-400 hover:text-slate-500 cursor-pointer"
                      title="Ver resultados"
                      onClick={() => handleResultsButton(poll._id)}
                    >
                      <i className="mgc_chart_bar_line"></i>
                    </button>
                    <button
                      className="text-slate-400 hover:text-slate-500 cursor-pointer"
                      title="Eliminar encuesta"
                      onClick={() => setPollToDelete(poll._id)}
                    >
                      <i className="mgc_delete_2_line"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Modal
        overlayClassName="fixed inset-0 z-100"
        className="rounded-lg border border-border card p-6 shadow-sm max-w-sm mx-4 sm:mx-auto mt-40 outline-none"
        isOpen={!!pollToDelete}
        contentLabel="Example Modal"
      >
        <h2 className="text-xl font-medium mb-4">
          ¿Estás seguro de que quieres eliminar esta encuesta?
        </h2>
        <p className="text-md text-muted-foreground mb-6">
          Esta acción no se puede deshacer
        </p>
        <div className="flex flex-row justify-center gap-3">
          <Button variant="text" onClick={() => setPollToDelete(null)}>
            Cancelar
          </Button>
          <Button onClick={handleDeletePoll}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
