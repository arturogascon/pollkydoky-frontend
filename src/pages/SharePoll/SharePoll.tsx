import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Link, useParams } from "react-router-dom";
import styles from "./SharePoll.module.css";
import Button from "../../components/atoms/Button";

const SharePoll = () => {
  const [isUrlCopied, setIsUrlCopied] = useState<boolean>(false);
  const { id } = useParams();
  const publicUrl = `${window.location.origin}/poll/${id}`;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setIsUrlCopied(true);
  };

  const handleQRDownload = () => {
    const qrCanva = document.getElementById("qr_canva") as HTMLCanvasElement;
    const pngUrl = qrCanva.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `poll-${id}-qr`;

    downloadLink.click();
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl mb-1">
        Comparte tu encuesta
      </h1>
      <p className="text-sm text-muted-foreground">
        Comparte este QR o el link para votar
      </p>

      <div className="m-4">
        <QRCodeCanvas
          id="qr_canva"
          className="mx-auto"
          value={publicUrl}
          size={256}
          onClick={handleQRDownload}
        />
      </div>

      <div>
        <span
          className={styles.checkmark}
          style={{ visibility: isUrlCopied ? "visible" : "hidden" }}
        >
          &#10003;
        </span>
        <Button variant="dashed" onClick={handleCopyUrl} title="Copiar URL">
          <span className="truncate">{publicUrl}</span>
        </Button>
      </div>

      <div>
        <button
          className="mt-2 
          font-semibold text-primary hover:underline hover:cursor-pointer"
          onClick={handleQRDownload}
        >
          Descargar QR
        </button>
      </div>

      <div className="mt-3 font-medium flex flex-row px-5 sm:px-0 sm:gap-4">
        <Link className="text-left w-fit" to={`/poll/${id}`}>
          Ir a pagina de votacion
        </Link>
        <Link
          className="text-right w-fit"
          to={{ pathname: `/poll/${id}`, search: "?results=true" }}
        >
          Ver resultados en tiempo real
        </Link>
      </div>
    </div>
  );
};

export default SharePoll;
