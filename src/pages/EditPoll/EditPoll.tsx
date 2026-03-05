import React, { useEffect, useRef, useState } from "react";
import { useEditPoll, useGetPoll } from "../../hooks/usePoll";
import { useNavigate, useParams } from "react-router-dom";
import { MAX_OPTIONS_LENGTH } from "../../utils/constants";
import { checkIsOptionRepeated } from "../../utils/optionsUtils";
import Input from "../../components/atoms/Input";

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
    <div className="form-container">
      {editPoll.isError && (
        <p className="error-label">Error al enviar formulario</p>
      )}
      <h2>Editar encuesta</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={question}
          name="question"
          label="Pregunta"
          placeholder="Pregunta"
          onChange={handleQuestionChange}
          error={questionError}
        />
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
                  className="inline-block ml-2 text-slate-600"
                  onClick={() => removeOption(index)}
                  title="Eliminar opción"
                >
                  <i className="mgc_eraser_line block icon-button"></i>
                </button>
              )}
              {isLastOption && optionNumber < MAX_OPTIONS_LENGTH && (
                <button
                  type="button"
                  className="inline-block ml-2"
                  onClick={addOption}
                  title="Agregar opción"
                >
                  <i className="mgc_add_line block icon-button"></i>
                </button>
              )}
            </div>
          );
        })}
        <button
          type="submit"
          className={`button self-end ${
            options.length === 1 ? "mr-6" : "mr-10"
          }`}
          disabled={isSubmitDisabled}
        >
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default EditPoll;
