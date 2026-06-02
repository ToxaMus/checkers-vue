import copy
from figures.cheker import Cheker
from figures.king import King
from board import Board

class GameAI:
    def __init__(self):
        self.__board: Board = None
        self.__checker = Cheker()
        self.__king = King()

    def moveAI(self, board: list[list[int]], color: str) -> tuple[tuple[int, int], tuple[int, int]]:
        self.__board = Board(copy.deepcopy(board))
        FIGURES = self.__board.get_all_color_figures(color)

        MOVES = []
        for figure in FIGURES:
            POSSIBLITY_MOVE = self.__checker.move(selectedFig=dict['x': figure['x'], 'y': figure['y']], colorFig=color, board=self.__board) if abs(figure['figure']) == 1 else self.__king.move(selectedFig=dict['x': figure['x'], 'y': figure['y']], colorFig=color, board=self.__board)

            if POSSIBLITY_MOVE is not None:
                MOVES.append(POSSIBLITY_MOVE)