import { useLanguage } from "../context/LanguageContext";

export default function ErrorState({ message, onRetry }) {
  const { t } = useLanguage();

  return (
    <div className="glass-panel rounded-[28px] p-8 text-center">
      <p className="text-lg">{message || t("errors.generic")}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="cta-secondary mt-5">
          {t("common.retry")}
        </button>
      ) : null}
    </div>
  );
}
