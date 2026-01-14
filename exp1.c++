#include <bits/stdc++.h>
using namespace std;
using namespace std::chrono;
long long operations;
void complexRec(int n) {
 operations++;

   if (n <= 2) {
       operations++;
       return;
   }


   int p = n;
   while (p > 0) {
       operations++;
       vector<int> temp(n);
       operations += n; 
       for (int i = 0; i < n; i++) {
           temp[i] = i ^ p;
            operations++;
       }
       p >>= 1;
   }


   vector<int> small(n);
   operations += n;
   for (int i = 0; i < n; i++) {
       small[i] = i * i;
       operations++;
   }


   if (n % 3 == 0) {
       reverse(small.begin(), small.end());
   } else {
       reverse(small.begin(), small.end());
   }


   complexRec(n / 2);
   complexRec(n / 2);
   complexRec(n / 2);
}

int main(){
    int n;
    cin>>n;
    auto start = high_resolution_clock::now();
    complexRec(n);
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(end - start);
  cout << "Input size (n): " << n << endl;
    cout << "Execution time (ms): " << duration.count() << endl;
    cout << "Total operations: " << operations << endl;
}
// recursive relation:3T(n/2)+nlogn+n
//T(n)=O(n^log3)      //base2 for log