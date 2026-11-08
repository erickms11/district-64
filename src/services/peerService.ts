import { Peer, type DataConnection } from 'peerjs'
import type { PeerMessage } from '../types'

export type ConnectionState = 'idle' | 'initializing' | 'waiting' | 'connecting' | 'connected' | 'disconnected' | 'error'

export interface PeerCallbacks {
  onStatusChange: (status: ConnectionState, message?: string) => void
  onMessage: (data: PeerMessage) => void
  onPeerOpen?: (peerId: string, roomCode: string) => void
}

const ROOM_PREFIX = 'district64-'

const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  }
}

export class PeerService {
  private peer: Peer | null = null
  private connection: DataConnection | null = null
  private callbacks: PeerCallbacks | null = null
  private roomCode: string = ''
  private isHost: boolean = false

  public setup(callbacks: PeerCallbacks) {
    this.callbacks = callbacks
  }

  // Generates clean 5-character readable code (e.g. "K7M9A")
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Host creates an arena
  public createRoom(code?: string): string {
    this.cleanup()
    this.roomCode = (code || this.generateRoomCode()).toUpperCase()
    this.isHost = true

    const fullPeerId = `${ROOM_PREFIX}${this.roomCode.toLowerCase()}`

    this.callbacks?.onStatusChange('initializing', 'Criando arena no Distrito 64...')

    this.peer = new Peer(fullPeerId, PEER_CONFIG)

    this.peer.on('open', (id) => {
      this.callbacks?.onPeerOpen?.(id, this.roomCode)
      this.callbacks?.onStatusChange('waiting', 'Aguardando o oponente entrar na arena...')
    })

    this.peer.on('connection', (conn) => {
      this.connection = conn
      this.attachConnectionListeners(conn)
    })

    this.peer.on('error', (err) => {
      console.error('Peer error:', err)
      if (err.type === 'unavailable-id') {
        console.warn('ID ocupado, gerando novo código de sala...')
        this.createRoom()
        return
      }
      this.callbacks?.onStatusChange('error', `Erro na conexão: ${err.type}`)
    })

    this.peer.on('disconnected', () => {
      this.callbacks?.onStatusChange('disconnected', 'Conexão P2P perdida.')
    })

    return this.roomCode
  }

  // Guest joins an arena
  public joinRoom(roomCode: string) {
    this.cleanup()
    this.roomCode = roomCode.trim().toUpperCase()
    this.isHost = false

    const targetPeerId = `${ROOM_PREFIX}${this.roomCode.toLowerCase()}`

    this.callbacks?.onStatusChange('initializing', 'Entrando na arena...')

    this.peer = new Peer(PEER_CONFIG)

    this.peer.on('open', () => {
      if (!this.peer) return
      this.callbacks?.onStatusChange('connecting', 'Conectando ao tributo anfitrião...')

      const conn = this.peer.connect(targetPeerId, {
        reliable: true
      })

      this.connection = conn
      this.attachConnectionListeners(conn)
    })

    this.peer.on('error', (err) => {
      console.error('Peer join error:', err)
      this.callbacks?.onStatusChange('error', 'Não foi possível encontrar a arena. Verifique o código.')
    })
  }

  private attachConnectionListeners(conn: DataConnection) {
    const handleOpen = () => {
      console.log('Canal de dados WebRTC aberto com sucesso!')
      this.callbacks?.onStatusChange('connected', 'Tributos conectados na Arena!')
    }

    if (conn.open) {
      handleOpen()
    } else {
      conn.on('open', handleOpen)
    }

    conn.on('data', (data) => {
      try {
        const parsed = (typeof data === 'string' ? JSON.parse(data) : data) as PeerMessage
        console.log('Mensagem P2P recebida:', parsed)
        this.callbacks?.onMessage(parsed)
      } catch (e) {
        console.error('Falha ao processar mensagem recebida:', e)
      }
    })

    conn.on('close', () => {
      this.callbacks?.onStatusChange('disconnected', 'Oponente abandonou a arena.')
    })

    conn.on('error', (err) => {
      console.error('Connection error:', err)
      this.callbacks?.onStatusChange('error', 'Erro no canal de dados.')
    })
  }

  public sendMessage(msg: PeerMessage) {
    if (!this.connection) {
      console.warn('Tentativa de envio sem conexão ativa:', msg)
      return
    }

    const payload = JSON.stringify(msg)
    if (this.connection.open) {
      this.connection.send(payload)
      console.log('Mensagem P2P enviada:', msg)
    } else {
      console.log('Conexão ainda abrindo, aguardando evento open para envio...')
      this.connection.once('open', () => {
        this.connection?.send(payload)
        console.log('Mensagem P2P enviada após abertura:', msg)
      })
    }
  }

  public getIsHost(): boolean {
    return this.isHost
  }

  public getRoomCode(): string {
    return this.roomCode
  }

  public cleanup() {
    if (this.connection) {
      try {
        this.connection.close()
      } catch (_) {}
      this.connection = null
    }
    if (this.peer) {
      try {
        this.peer.destroy()
      } catch (_) {}
      this.peer = null
    }
  }
}

export const peerService = new PeerService()
