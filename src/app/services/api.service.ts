import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TokensMetaData} from "../interfaces/main";

@Injectable()

export class ApiService {
  constructor(private http: HttpClient) {
  }

  getInfoAboutToken(tokenTech: any): Observable<TokensMetaData>{
    const url = 'https://pumpportal.fun/api/data/token-info?ca=' + tokenTech.mint;
    return this.http.get<TokensMetaData>(url).pipe(map(data => {
      // @ts-ignore
      data.mint = tokenTech
      return data;
    }))
  }

  buy(CA: string) {
    const url = "https://pumpportal.fun/api/trade?api-key=9nqkck2ra0vjpe3bcn8mphvbedpm8eaectc62t3t99a6jujm8htncuumetr3ae3qd1m7mjk7dx24yxk795h7gj23cdd7ep2haxqn6gj8agu5mwvf9han4gub9hppewvmcmu56wu6a4ykuanrpjcbp70wkgeb5dhp7arat9c95nm2m3ue1a6jxhkaww68eb7enp4jgv9b5vkuf8"
    const dataToSend = {
      "action": 'buy',
      "mint": CA,
      "amount": 0.001,
      "denominatedInSol": 'true',
      "slippage": 10,
      "priorityFee": 0.01,
      "pool": "pump"
    }
  return this.http.post(url, dataToSend)
  }

  sell(CA: string, amount: number | undefined) {
    const url = "https://pumpportal.fun/api/trade?api-key=9nqkck2ra0vjpe3bcn8mphvbedpm8eaectc62t3t99a6jujm8htncuumetr3ae3qd1m7mjk7dx24yxk795h7gj23cdd7ep2haxqn6gj8agu5mwvf9han4gub9hppewvmcmu56wu6a4ykuanrpjcbp70wkgeb5dhp7arat9c95nm2m3ue1a6jxhkaww68eb7enp4jgv9b5vkuf8"
    const dataToSend = {
      "action": 'sell',
      "mint": CA,
      "amount": amount,
      "denominatedInSol": 'false',
      "slippage": 10,
      "priorityFee": 0.01,
      "pool": "pump"
    }
    return this.http.post(url, dataToSend)
  }

}
