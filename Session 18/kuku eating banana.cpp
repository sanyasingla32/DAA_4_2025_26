

class Solution {
public:
  int valid(vector<int>&piles,int h,int k){
    int i=0;int t=0;
    while(i<piles.size()){
        if( piles[i]%k==0){
            t+=(piles[i]/k);
        }
        else{
            t +=  (piles[i]/k)+1;
        }
        i++;
    }
    return t;
  }
    int minEatingSpeed(vector<int>& piles, int h) {
       int n = *max_element(piles.begin(), piles.end());
        int l=1;
        int r=n;
        while(l<r){
        int mid=(l+r)/2;
        int k=valid(piles,h,mid);
        if(k>h){
            l=mid+1;
        }
        else{
            r=mid;
        }
        }
  return l;
       
    }
};