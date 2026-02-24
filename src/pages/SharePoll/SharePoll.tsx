import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Link, useParams } from "react-router-dom";
import styles from "./SharePoll.module.css";

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
      <h2>Comparte tu encuesta</h2>
      <p>Comparte este QR o el link para votar</p>

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
        <button
          className={styles.publicUrl}
          onClick={handleCopyUrl}
          title="Copiar URL"
        >
          {publicUrl}
        </button>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className="font-semibold hover:font-bold"
          onClick={handleQRDownload}
        >
          Descargar QR
        </button>
      </div>

      <div className={styles.linksContainer}>
        <Link to={`/poll/${id}`}>Ir a pagina de votacion</Link>
        <Link to={{ pathname: `/poll/${id}`, search: "?results=true" }}>
          Ver resultados en tiempo real
        </Link>
      </div>
    </div>
  );
};

export default SharePoll;
