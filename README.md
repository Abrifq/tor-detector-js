# tor-detector-with-dns

Why this name? I ran out of good names. Most of them are taken.

Check if a request you received is routed via tor.

- `FileBasedChecker` uses the traditional ip file strategy
- `DNSBasedChecker` uses [the new (2020) DNS query strategy](https://lists.torproject.org/pipermail/tor-project/2020-March/002759.html#DNS-Exit-List
) (less waste!)

## Usage

Depending on your usage, use either `tor-detector/dns-checker.js` to check via DNS queries or `tor-detector/local-checker.js` to check with TOR's own auto-published list.

For example, use dns checker for realtime detection and local checker for when you got a list of IPs to skim through.

Both classes have the same function signature:

- `check(ip: string): Promise<boolean>`, takes in an IPv4 address, returns a boolean promise.

```ts
import { DNSBasedChecker as TorChecker } from "tor-checker/dns-checker"
import * as requestIP from "request-ip";
import { NextFunction, Request, Response } from "express"

const torChecker = new TorChecker();

async function handleIPMiddleware(req: Request, res: Response, next: NextFunction) {
    if (await torChecker.check(requestIP.getClientIp(req)))
        handleTorUser(req, res);
    return next();
}

//handle tor users differently. for example, put a banner on top of the template
function handleTorUser(req: Request, res: Response) {
    return res.redirect("/tor-welcome")
}
```

### Advanced Usage

- IP List files get updated "around every 40 minutes", this project fetches the IP list file again if an hour passed since the last request.
  You can change this behavior in `FileBasedChecker` class' constructor by giving it a new Time To Live time, in milliseconds.

- IP List url may get changed or you may have found a more accurate provider, fear not!
  You can change the IP list link url by providing the new url to `FileBasedChecker` class' constructor.

- The DNS Query system may get updated and change how the DNS query is formed. (Or maybe you are using a different provider, who knows)
  You can change the default query constructor with your own one, in `DNSBasedChecker` class' constructor.
