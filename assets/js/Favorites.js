import { GithubUser } from "./GithubUser.js"
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }



  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) ||  []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }


      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }


      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update(this.entries)
    this.save()
  }
}


export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.createRow()
    this.tbody = this.root.querySelector('table tbody')
    this.main  = this.root.querySelector('main')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()
    if(this.entries.length == 0){

      this.removeAllTr()
      const div = this.createDivEmpty()

      div.style.width = '122rem';
      this.main.append(div)
    }else{
      this.entries.forEach( user => {
        const row = this.createRow()
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers
  
        row.querySelector('.remove').onclick = () => {
          const isOk = confirm('Tem certeza que deseja deletar essa linha?')
          if(isOk) {
            this.delete(user)
          }
        }
        
        this.tbody.append(row)
        console.log(this.div)
        const div = this.main.querySelector('.empty')
        if (div) {
          div.remove();
        }
      })
    }
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <tbody>
        <td class="user">
          <img src="" alt="">
          <a href="" target="_blank">
            <p></p>
            <span></span>
          </a>
        </td>
        <td class="repositories"></td>
        <td class="followers"></td>
        <td>
          <button class="remove">Remover</button>
        </td>
      </tbody>
    `

    return tr
  }

  createDivEmpty(){
    const div = document.createElement('div')
    div.classList.add('empty')
    div.innerHTML = `
        <img src="../assets/imgs/empty.svg" alt="empty User">
        <p>Nenhum favorito ainda</p>
        </a>
    `
    return div
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })  
  }

}