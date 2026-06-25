# Contrato do SpeedTest Web

## Princípio

SpeedTest web mede a experiência HTTP do navegador, não a verdade absoluta da rede.

O resultado deve ser útil, mas deve comunicar limitações quando necessário.

Este contrato segue a paridade definida em `pwa/docs/parity.md`.

## Status de paridade

SpeedTest no PWA é `equivalente-degradado`.

É equivalente na promessa principal: medir velocidade e estabilidade percebida.

É degradado porque o browser não mede ICMP, rede física, rádio Wi‑Fi ou telemetria nativa.

## Download

Status: obrigatório para M1.

Estratégia inicial:

- baixar arquivo controlado ou endpoint próprio;
- medir tempo total;
- calcular Mbps aproximado;
- descartar amostra com erro;
- usar múltiplas amostras se possível.

```ts
type DownloadMetric = {
  mbps: number | null;
  durationMs: number;
  bytes: number;
  samples: number;
  status: 'measured' | 'failed' | 'not_supported';
};
```

## Upload

Status: desejável, mas depende de endpoint.

Não implementar upload real sem endpoint controlado.

Se não houver endpoint, exibir como não medido.

```ts
type UploadMetric = {
  mbps: number | null;
  durationMs?: number;
  bytes?: number;
  samples?: number;
  status: 'measured' | 'failed' | 'not_available';
};
```

## Latência

Status: obrigatório para M1.

Estratégia:

- requisições leves para endpoint controlado;
- medição com `performance.now()`;
- usar mediana ou média robusta;
- não chamar de ping ICMP.

```ts
type LatencyMetric = {
  ms: number | null;
  samples: number;
  status: 'measured' | 'failed';
  method: 'http_timing';
};
```

## Jitter

Status: desejável.

Estratégia:

- calcular variação entre amostras de latência;
- medir só com amostras suficientes;
- se não houver amostras, marcar como não medido.

```ts
type JitterMetric = {
  ms: number | null;
  samples: number;
  status: 'measured' | 'insufficient_samples' | 'failed';
};
```

## Bufferbloat

Status: futuro, não obrigatório para M1.

Pode ser estimado com múltiplas requisições paralelas e comparação de latência sob carga.

Não implementar como métrica principal sem validar metodologia e UX.

```ts
type BufferbloatMetric = {
  ms: number | null;
  severity: 'none' | 'light' | 'moderate' | 'severe' | 'unknown';
  status: 'measured' | 'not_measured' | 'failed';
};
```

## Perda percebida

Status: inferida, não real.

No navegador, não há medição confiável de perda de pacote via ICMP.

Pode ser inferida por falhas HTTP, timeouts ou indisponibilidade.

```ts
type AvailabilityMetric = {
  failedRequests: number;
  totalRequests: number;
  perceivedLossPercent: number | null;
  status: 'inferred' | 'not_measured';
};
```

## Payload mínimo

```ts
type SpeedTestResult = {
  id: string;
  measuredAt: string;
  download: DownloadMetric;
  upload: UploadMetric;
  latency: LatencyMetric;
  jitter: JitterMetric;
  availability: AvailabilityMetric;
  bufferbloat?: BufferbloatMetric;
  browser: BrowserInfo;
  connection: BrowserConnectionInfo;
  limitations: string[];
};
```

## Browser info

```ts
type BrowserInfo = {
  userAgent?: string;
  platform?: string;
  language?: string;
  viewport?: {
    width: number;
    height: number;
  };
};
```

## Connection info

```ts
type BrowserConnectionInfo = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  source: 'network_information_api' | 'unavailable';
};
```

## Limitações obrigatórias

Registrar quando aplicável:

- `http_latency_not_icmp_ping`;
- `upload_endpoint_unavailable`;
- `network_information_api_unavailable`;
- `packet_loss_not_directly_measured`;
- `browser_measurement_may_vary`;
- `wifi_signal_not_available_on_web`.

## Critérios de aceite

- Download não pode ser valor falso.
- Latência não pode ser chamada de ping real.
- Upload só aparece como medido se existir endpoint.
- Jitter só aparece como medido se houver amostras suficientes.
- Perda de pacote deve ser comunicada como inferência.
- Resultado parcial deve ser permitido em caso de erro.
- A UI deve diferenciar velocidade, estabilidade e limitações do browser.

## Fora do escopo

- ICMP real.
- Sinal Wi‑Fi/RSSI.
- Scan de rede.
- Identificação de roteador.
- Medição nativa de operadora.
- DNS benchmark real.

## Texto de limitação para UI

“Este teste mede a experiência da conexão pelo navegador. Algumas medições avançadas, como sinal Wi‑Fi real ou perda de pacote nativa, não estão disponíveis na versão web.”
