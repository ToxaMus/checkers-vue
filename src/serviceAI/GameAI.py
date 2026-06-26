import copy
from serviceAI.figures.checker import Checker
from figures.king import King
from board import Board
from typing import Optional, Tuple, List 

class GameAI:
    def __init__(self):
        self.__board: Board = None
        self.__checker = Checker()
        self.__king = King()


    def moveAI(self, board: list[list[int]], color: str) -> Optional[List[Tuple[Tuple[int, int], Tuple[int, int]]]]:
        self.__board = Board(copy.deepcopy(board))
        MOVES = self.__get_moves(color) if len(MOVES) > 0 else None


    def __get_moves(self, colorMove: str) -> List[Tuple[Tuple[int, int], Tuple[int, int]]]:
        FIGURES = self.__board.get_all_color_figures(colorMove)
        MOVES = []
        
        for figure in FIGURES:
            POSSIBLITY_MOVE = self.__checker.move(selectedFig=dict['x': figure['x'], 'y': figure['y']], colorFig=colorMove, board=self.__board) if abs(figure['figure']) == 1 else self.__king.move(selectedFig=dict['x': figure['x'], 'y': figure['y']], colorFig=colorMove, board=self.__board)

            if POSSIBLITY_MOVE is not None:
                MOVES.append(POSSIBLITY_MOVE)

        return MOVES