# tor-detector

Check if a request you received is routed via tor.

## Usage

Depending on your usage, use either `tor-detector/dns-checker.js` to check via DNS queries or `tor-detector/local-checker.js` to check with TOR's own auto-published list.

For example, use dns checker for realtime detection and local checker for when you got a list of IPs to skim through.

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
