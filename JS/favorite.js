import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }
 
  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) return

      const user = await GithubUser.search(username) 

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado')
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
    .filter(entry => user.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
  
}

export class FavoritesView extends Favorites{
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach((user) => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector(".user img").alt = `imagem de ${user.name}`
      row.querySelector(".user a").src = `https://github.com/${user.login}`
      row.querySelector(".user p").textContent = `${user.name}`
      row.querySelector(".user p").textContent = `${user.login}`
      row.querySelector(".repositories").textContent = `${user.public_repos}`
      row.querySelector(".followers").textContent = `${user.followers}`

      row.querySelector(".remove").onclick = () => {
        const isOK = confirm('Tem certeza que deseja excluir esse usuário?')

        if(isOK) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })

    
  }

  createRow () {

    const tr = document.createElement('tr')
    tr.innerHTML = `
          <td class="user">
            <img src="" alt="Imagem do Github">
            <a href="">
              <p>Luigi</p>
              <span>/luigiebo</span>
            </a>
          </td>
          <td class="repositories">
            123
          </td>
          <td class="followers">
            1234
          </td>
          <td class="remover">
            <button class="remove">Remover</button>
            </td>
            `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}