import React, { useEffect, useRef, useState } from "react";
import { useEditPoll, useGetPoll } from "../../hooks/usePoll";
import { useNavigate, useParams } from "react-router-dom";
import { MAX_OPTIONS_LENGTH } from "../../utils/constants";
import { checkIsOptionRepeated } from "../../utils/optionsUtils";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";

const EditPoll = () => {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([""]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const { id } = useParams();

  const { data: poll, isLoading, error: queryError } = useGetPoll(id!);

  const editPoll = useEditPoll(id!);
  const lastOptionRef = useRef<HTMLInputElement>(null);
  const validOptions = options.filter((option) => !!option);

  const isOptionRepeated = checkIsOptionRepeated(options);
  const optionError = isOptionRepeated ? "No puedes repetir opción" : undefined;

  const navigate = useNavigate();

  useEffect(() => {
    if (poll?.question) {
      setQuestion(poll.question);
    }

    if (poll?.options) {
      const previousOptions = poll.options.map((option) => option.text);
      setOptions(previousOptions);
    }
  }, [poll]);

  useEffect(() => {
    if (lastOptionRef && options.length > 2) {
      lastOptionRef?.current?.focus();
    }
  }, [options.length]);

  useEffect(() => {
    const areOptionsEdited = validOptions.some(
      (option, index) => option !== poll?.options[index].text,
    );
    if (
      (question && question !== poll?.question) ||
      (validOptions.length > 0 &&
        validOptions.length !== poll?.options.length) ||
      isOptionRepeated ||
      areOptionsEdited
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [question, validOptions]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;

    setOptions(newOptions);
  };

  const removeOption = (optionIndex: number) => {
    const updatedOptions = options.filter(
      (_option, index) => index !== optionIndex,
    );
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
    lastOptionRef?.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    editPoll.mutate(
      { question, options },
      {
        onSuccess: () => {
          navigate(`/polls/${id}/share`);
        },
      },
    );
  };

  const questionError =
    question.length > 0 && question.length < 5
      ? "El mínimo de caracteres es 5"
      : question.length > 200
        ? "El máximo de caracteres es 200"
        : "";

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
    <div>
      {editPoll.isError && (
        <p className="error-label">Error al enviar formulario</p>
      )}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Editar encuesta</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <Input
            value={question}
            name="question"
            label="Pregunta"
            placeholder="Pregunta"
            onChange={handleQuestionChange}
            error={questionError}
          />
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm flex flex-col gap-2">
          {options.map((option, index, arr) => {
            const optionNumber = index + 1;
            const isLastOption = index === arr.length - 1;
            return (
              <div
                key={`option_container_${optionNumber}`}
                className="flex items-center"
              >
                <Input
                  value={option}
                  name={`options_${optionNumber}`}
                  label={`Opción ${optionNumber}`}
                  onChange={(e) => handleOptionsChange(e, index)}
                  placeholder={`Opción ${optionNumber}`}
                  ref={isLastOption ? lastOptionRef : undefined}
                  error={optionError}
                />

                {index > 0 && (
                  <button
                    type="button"
                    className="inline-block ml-2 mt-4 text-slate-600 cursor-pointer"
                    onClick={() => removeOption(index)}
                    title="Eliminar opción"
                  >
                    <i className="mgc_delete_2_line block icon-button"></i>
                  </button>
                )}
              </div>
            );
          })}
          {options.length < MAX_OPTIONS_LENGTH && (
            <Button
              variant="dashed"
              type="button"
              icon="add_line"
              onClick={addOption}
              className="mt-2"
            >
              Agregar opción
            </Button>
          )}
        </div>
        <Button
          type="submit"
          className="self-end w-full sm:w-32"
          disabled={isSubmitDisabled}
          icon="edit_line"
        >
          Actualizar
        </Button>
      </form>
    </div>
  );
};

export default EditPoll;
