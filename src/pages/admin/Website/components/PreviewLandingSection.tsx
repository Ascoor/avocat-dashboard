import type { ContentBlock, Locale } from '@/types/website';

interface PreviewLandingSectionProps {
  locale: Locale;
  title?: string | null;
  blocks: ContentBlock[];
}

const renderValue = (value: unknown, type: string | null | undefined) => {
  if (type === 'json' && value) {
    try {
      return <pre className="rounded-md bg-muted/60 p-3 text-xs">{JSON.stringify(value, null, 2)}</pre>;
    } catch (error) {
      return <pre className="rounded-md bg-muted/60 p-3 text-xs">{String(value)}</pre>;
    }
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc space-y-1 pl-6 text-sm">
        {value.map((item, index) => (
          <li key={`${index}-${String(item)}`}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'string') {
    const isImage = type?.includes('image') || type?.includes('media') || /\.(png|jpe?g|gif|webp|svg)$/i.test(value);
    if (isImage) {
      return (
        <div className="overflow-hidden rounded-lg border bg-background">
          <img src={value} alt="Preview asset" className="h-48 w-full object-cover" />
        </div>
      );
    }

    return <p className="text-sm leading-relaxed">{value}</p>;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return <p className="text-sm font-medium">{String(value)}</p>;
  }

  if (!value) {
    return <p className="text-sm italic text-muted-foreground">Empty value</p>;
  }

  return <pre className="rounded-md bg-muted/60 p-3 text-xs">{JSON.stringify(value, null, 2)}</pre>;
};

const PreviewLandingSection: React.FC<PreviewLandingSectionProps> = ({ locale, title, blocks }) => {
  return (
    <div className="space-y-4">
      {title ? <h3 className="text-lg font-semibold text-foreground">{title}</h3> : null}

      <div className="space-y-4">
        {blocks.map((block, index) => {
          const localized = block.value?.[locale];

          return (
            <div key={`${block.key ?? 'block'}-${locale}-${index}`} className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{block.key}</p>
              {renderValue(localized, block.type)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewLandingSection;
