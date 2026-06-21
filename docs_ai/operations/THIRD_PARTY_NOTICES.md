# Third-Party Notices

Este arquivo lista as bibliotecas de código aberto utilizadas pelo SignallQ (Veloo)
com suas respectivas licenças e informações de atribuição.

---

## AndroidNetworkTools

- **Autor:** Stephan Cilliers (stealthcopter)
- **Repositório:** https://github.com/stealthcopter/AndroidNetworkTools
- **Versão em uso:** 0.4.5.3
- **Licença:** Apache License, Version 2.0

### Uso no SignallQ

Utilizado pelo módulo `featureDevices` para:
- Descoberta de hosts via ping nativo (`SubnetDevices`) — substitui `InetAddress.isReachable()` que não funciona sem root em Android 10+.
- Lookup de MAC via cache ARP (`ARPInfo.getMacFromIPAddress()`).

### Texto da Licença Apache 2.0

```
Copyright 2016 Stephan Cilliers

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

Texto completo disponível em: https://www.apache.org/licenses/LICENSE-2.0

---

*Última atualização: 2026-06-21*
