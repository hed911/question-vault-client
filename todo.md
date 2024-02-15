
Tasks:
- Make the change level method
- Make the mark as i dont know the answer
- Fix the header on resume
- Replace buttons with the ones in the Library



Future tasks:
- Handle authentication

Install stuff
npm install packagename --save
npx expo prebuild
npx pod-install
npx expo start



- be able to run the app in the phone
- test text to speech
- make changes in the backend to support change dificulty!
- study system design interviews!




- Observability patterns
- Microservices in deep
- How works Turbo in Rails 7?


V2Ingreso.where(created_at: (Time.now - 2.months)..Time.now).each do |x|
    x.set_posible_repetido
    x.save
end